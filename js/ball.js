function Ball (world, color, spawnPosition) {
    // Shortcuts
    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ;

    // Properties
    this.world = world;
    this.color = color;
    this.spawnPosition = spawnPosition;
    this.radius = 0.75;
    this.maxSpeed = 12;
    this.fixture = null;
    this.threeObject = null;
    this.sound = null;

    // Methods
    this.getFixture = function () {
        return this.fixture;
    };

    this.init = function() {
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0;
        fixDef.restitution = 1;
        fixDef.shape = new b2CircleShape(this.radius);

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = this.spawnPosition[0];
        bodyDef.position.y = this.spawnPosition[1];

        this.fixture = this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        var geometry = new THREE.CylinderGeometry(this.radius, this.radius, 0, 50, 1, false);
        var material = new THREE.MeshBasicMaterial({ color: this.color });
        this.threeObject = new THREE.Mesh(geometry, material);
        this.threeObject.rotation.x += 90 * Math.PI / 180;

        this.sound = new Sound(['sounds/ball.mp3', 'sounds/ball.ogg']);
    };

    this.physics = function () {
        var body = this.fixture.GetBody(),
            pos = body.GetDefinition().position,
            velocity = body.GetLinearVelocity(),
            speed = velocity.Length()
        ;

        if (speed > this.maxSpeed) {
            body.SetLinearVelocity(
                new b2Vec2(
                    this.maxSpeed / speed * velocity.x,
                    this.maxSpeed / speed * velocity.y
                )
            );
        }

        this.threeObject.position.x = pos.x;
        this.threeObject.position.y = pos.y;

        if (this.hasTouchingContact()) {
            this.sound.play(true);
        }
    };

    this.hasTouchingContact = function () {
        var touching = false,
            contacts = this.fixture.GetBody().GetContactList()
        ;

        while (touching === false && contacts !== null) {
            touching = contacts.contact.IsTouching();
            contacts = contacts.next;
        }

        return touching;
    };

    this.init();
}