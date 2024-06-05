document.getElementById('projectileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const angle = parseFloat(document.getElementById('angle').value) * (Math.PI / 180); // Convertir a radianes
    const initialHeight = parseFloat(document.getElementById('initialHeight').value);
    const time = parseFloat(document.getElementById('time').value);
    const g = 9.81; // Aceleración debido a la gravedad en m/s^2

    // Calcular la velocidad inicial del proyectil
    const velocityInitialY = (1/2*g*(time*time)-initialHeight)/time;
    const velocityInitial= velocityInitialY/Math.sin(angle);

    // Calcular la distancia final
    const distance = velocityInitial * time * Math.cos(angle);

    // Calcular la altura máxima
    const heightMax = initialHeight + (Math.pow(velocityInitial, 2) * Math.pow(Math.sin(angle), 2)) / (2 * g);

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Distancia final: ${distance.toFixed(2)} metros<br>Velocidad inicial: ${velocityInitial.toFixed(2)} m/s<br>Altura máxima: ${heightMax.toFixed(2)} metros`;

    animateProjectile(angle, initialHeight, time, distance, velocityInitial);
});

function animateProjectile(angle, initialHeight, time, distance, velocityInitial) {
    const projectile = document.getElementById('projectile');
    const container = document.getElementById('animationContainer');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Calcular la distancia final en píxeles
    const finalPositionX = (distance / 30) * containerWidth; // Asumiendo 1 metro = 1% del contenedor
    const initialPositionY = (initialHeight / 5) * containerHeight; // Asumiendo 1 metro = 10% del contenedor

    // Reiniciar la posición del proyectil
    projectile.style.left = '0px';
    projectile.style.bottom = `${initialPositionY}px`;

    // Eliminar los trazos anteriores
    const oldTrails = document.querySelectorAll('.trail');
    oldTrails.forEach(trail => trail.remove());

    // Parabolas
    let startTime = null;
    const scale = 1.5; // Factor de escala para ralentizar la animación

    function parabolaAnimation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = (currentTime - startTime) / 1000; // Convertir a segundos
        const t = Math.min(timeElapsed / (time * scale), 1); // Reducir la velocidad de la animación

        // Movimiento parabólico
        const progressX = t * finalPositionX;
        let progressY = initialPositionY + (velocityInitial * Math.sin(angle) * t) - (0.5 * 9.81 * Math.pow(t, 2) * 100);

        // Limitar la posición vertical del proyectil
        if (progressY < 0) {
            progressY = 0;
        } else if (progressY > containerHeight) {
            progressY = containerHeight;
        }

        projectile.style.left = `${progressX}px`;
        projectile.style.bottom = `${progressY}px`;

        // Crear un trazo punteado
        if (t % 0.05 < 0.01) {
            const trail = document.createElement('div');
            trail.className = 'trail';
            trail.style.left = `${progressX}px`;
            trail.style.bottom = `${progressY}px`;
            container.appendChild(trail);
        }

        if (t < 1) {
            requestAnimationFrame(parabolaAnimation);
        }
    }

    // Iniciar la animación
    requestAnimationFrame(parabolaAnimation);
}
