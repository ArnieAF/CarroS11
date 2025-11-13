var fondo;
var carro;
var cursores;
var enemigos;
var timer;

var gasolinas;
var timerGasolina;

var puntaje = 0;
var textoPuntaje;

var Juego = {

    preload: function () {
        juego.load.image('bg', 'img/bg.png');
        juego.load.image('carro', 'img/carro.png');
        juego.load.image('carroMalo', 'img/carroMalo.png');
        juego.load.image('gasolina', 'img/gas.png');
    },

    mostrarPopup: function() {
        this.juegoTerminado = true;
        this.popup.visible = true;
    },

    reiniciarJuego: function() {
        puntaje = 0;
        this.juegoTerminado = false;
        juego.state.restart();
    },

    create: function () {

        // Fondo
        fondo = juego.add.tileSprite(0, 0, 290, 540, 'bg');

        // Carro
        carro = juego.add.sprite(juego.width/2, 496, 'carro');
        carro.anchor.setTo(0.5);
        juego.physics.arcade.enable(carro);

        // Puntaje
        textoPuntaje = juego.add.text(10, 10, 'Puntaje: 0', { 
            fontSize: '18px', 
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        });

        // Enemigos
        enemigos = juego.add.group();
        juego.physics.arcade.enable(enemigos, true);
        enemigos.enableBody = true;
        enemigos.createMultiple(20, 'carroMalo');
        enemigos.setAll('anchor.x', 0.5);
        enemigos.setAll('anchor.y', 0.5);
        enemigos.setAll('outOfBoundsKill', true);
        enemigos.setAll('checkWorldBounds', true);

        // Gasolinas
        gasolinas = juego.add.group();
        juego.physics.arcade.enable(gasolinas, true);
        gasolinas.enableBody = true;
        gasolinas.createMultiple(20, 'gasolina');
        gasolinas.setAll('anchor.x', 0.5);
        gasolinas.setAll('anchor.y', 0.5);
        gasolinas.setAll('outOfBoundsKill', true);
        gasolinas.setAll('checkWorldBounds', true);

        // --- POPUP GAME OVER ---
        this.popup = juego.add.group();

        var fondoPopup = juego.add.graphics(0, 0);
        fondoPopup.beginFill(0x000000, 0.7);
        fondoPopup.drawRect(0, 0, juego.width, juego.height);
        this.popup.add(fondoPopup);

        var cuadro = juego.add.graphics(0, 0);
        cuadro.beginFill(0x222222, 1);
        cuadro.drawRect(juego.width/2 - 120, juego.height/2 - 80, 240, 160);
        this.popup.add(cuadro);

        var txtGameOver = juego.add.text(
            juego.width/2, 
            juego.height/2 - 40, 
            "¡GAME OVER!", 
            { fontSize: "24px", fill: "#FFFFFF" }
        );
        txtGameOver.anchor.setTo(0.5);
        this.popup.add(txtGameOver);

        var btnReiniciar = juego.add.text(
            juego.width/2, 
            juego.height/2 + 20, 
            "Reiniciar", 
            { fontSize: "20px", fill: "#00FF00" }
        );
        btnReiniciar.anchor.setTo(0.5);
        btnReiniciar.inputEnabled = true;
        btnReiniciar.events.onInputDown.add(this.reiniciarJuego, this);
        this.popup.add(btnReiniciar);

        this.popup.visible = false;
        this.juegoTerminado = false;

        // Timers
        timer = juego.time.events.loop(1500, this.crearCarroMalo, this);
        timerGasolina = juego.time.events.loop(2000, this.crearGasolina, this);

        // Controles
        cursores = juego.input.keyboard.createCursorKeys();
    },

    update: function() {

        if (this.juegoTerminado) return;

        fondo.tilePosition.y += 3;

        if (cursores.right.isDown && carro.position.x < 245) {
            carro.position.x += 5;
        }
        else if (cursores.left.isDown && carro.position.x > 45) {
            carro.position.x -= 5;
        }
        
        juego.physics.arcade.overlap(carro, enemigos, this.colisionEnemigo, null, this);
        juego.physics.arcade.overlap(carro, gasolinas, this.colisionGasolina, null, this);
    },

    crearCarroMalo: function() {
        var posicion = Math.floor(Math.random() * 3) + 1;
        var enemigo = enemigos.getFirstDead();
        enemigo.physicsBodyType = Phaser.Physics.ARCADE;
        enemigo.reset(posicion * 73, 0);
        enemigo.body.velocity.y = 200;
        enemigo.anchor.setTo(0.5);
    },

    crearGasolina: function() {
        var posicion = Math.floor(Math.random() * 3) + 1;
        var gasolina = gasolinas.getFirstDead();
        gasolina.physicsBodyType = Phaser.Physics.ARCADE;
        gasolina.reset(posicion * 73, 0);
        gasolina.body.velocity.y = 200;
        gasolina.anchor.setTo(0.5);
    },

    colisionEnemigo: function(carro, enemigo) {
        enemigo.kill();
        puntaje = Math.max(0, puntaje - 10);
        textoPuntaje.text = 'Puntaje: ' + puntaje;
        this.mostrarPopup();
    },

    colisionGasolina: function(carro, gasolina) {
        gasolina.kill();
        puntaje += 5;
        textoPuntaje.text = 'Puntaje: ' + puntaje;
    }
};
