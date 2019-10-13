var canvasDots = document.getElementById('dotsCanvas');
var canvasSpots = document.getElementById('spotsCanvas');


var cDots = canvasDots.getContext('2d');
var cSpots = canvasSpots.getContext('2d');


canvasDots.width = window.innerWidth;
canvasDots.height = window.innerHeight;

canvasSpots.width = window.innerWidth;
canvasSpots.height = window.innerHeight;

const nrInstances = 250;
const minDistanceFromCenter = 100;
const maxDistanceFromCenter = 200;

const minRadius = 2;
const maxRadius = 15;


var time;
var counterTimePassed;

const colors = [
    '#b152ff',
    '#ff5278',
    '#52ff94',
    '#ffee52'
]

//Event listeners

addEventListener('resize', () => {
    canvasDots.width = innerWidth;
    canvasDots.height = innerHeight;

    canvasSpots.width = innerWidth;
    canvasSpots.height = innerHeight;

    init();
});

//Helper functions

const randomIntFromRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomColor = (listColors) => {
    return listColors[Math.floor(Math.random() * listColors.length)];
}

const pingPong = () => {
    return Math.cos(counterTimePassed);
}

const mapValueFromTo = (value, minFrom, maxFrom, minTo, maxTo) => {
    console.log(value);
    let mappedValue=((value - minFrom) * 1.0) / (maxFrom) * (maxTo - minTo) + minTo;
    console.log(mappedValue);
    return mappedValue;
}

class Time {
    constructor() {
        this.currentDate = new Date();
        this.previousDate = new Date();
    }
    getDeltaTime() {
        return (this.currentDate.getTime() - this.previousDate.getTime()) / 1000;
    }
}

class Circle {
    constructor(x, y, color) {
        this.centerX = x;
        this.centerY = y;

        this.color = color;
        this.velocity = Math.random() * 0.05 + 0.01;
        this.radians = Math.random() * Math.PI * 2;
        this.distanceFromCenter = randomIntFromRange(minDistanceFromCenter, maxDistanceFromCenter);
        this.radius = mapValueFromTo(this.distanceFromCenter, minDistanceFromCenter, maxDistanceFromCenter, minRadius, maxRadius);

        this.x = this.centerX + Math.cos(this.radians/3) * Math.PI * this.distanceFromCenter;
        this.y = this.centerY + Math.sin(this.radians) * this.distanceFromCenter;
    }

    update = () => {
        const lastPoint = { x: this.x, y: this.y }
        this.radians += this.velocity;

        this.x = this.centerX + Math.cos(this.radians/3) * Math.PI * this.distanceFromCenter;
        this.y = this.centerY + Math.sin(this.radians) * this.distanceFromCenter;

        this.drawFill();
        this.draw(lastPoint);
    }

    draw = lastPoint => {
        cDots.beginPath();
        cDots.strokeStyle = this.color;
        cDots.lineWidth = this.radius;
        cDots.moveTo(lastPoint.x, lastPoint.y);
        cDots.lineTo(this.x, this.y);
        cDots.stroke();

        cDots.closePath();
    }

    drawFill = () => {
        cSpots.beginPath();
        cSpots.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2, false);
        cSpots.fillStyle = this.color;
        cSpots.fill();
        cSpots.closePath();
    }
}

//Implementation
let particles;
const init = () => {
    counterTimePassed = 0;

    time = new Time();

    particles = [];
    for (let i = 0; i < nrInstances; i++) {
        particles.push(new Circle(canvasDots.width / 2, canvasDots.height / 2, randomColor(colors)));
    }

    cDots.fillStyle = '#241e2b';
    cDots.fillRect(0, 0, canvasDots.width, canvasDots.height);
}

//Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    cDots.fillStyle = '#241e2b40';
    cDots.fillRect(0, 0, canvasDots.width, canvasDots.height);

    cSpots.clearRect(0, 0, canvasSpots.width, canvasSpots.height);

    time.currentDate = new Date();
    counterTimePassed += time.getDeltaTime();


    particles.forEach(particle => {
        particle.update();
    });

    time.previousDate = time.currentDate;
}

init();
animate();

