/**
 * This is bad and unoptimized code just for you to fix :)
 *
 * Get Firefox Developer Edition to try the new Performance Tools:
 *   https://www.mozilla.org/firefox/developer/
 *
 * 1. Open the `Performance` tool in Firefox Developer Edition
 * 2. Start recording a performance profile
 * 3. Play the game
 * 4. Stop profiling and check the Call Tree or Flame Chart for the maleficent
 *
 * Got ideas for better bottlenecks or even faster code, file
 * an issue or send us a pull request:
 *   https://github.com/mozilla/devtools-perf-game/issues
 */

/**
 * Creates a new array with all elements that pass the `test` function
 * @param {Array} array The array to filter
 * @param {Function} test Function to test each element, invoked with (element)
 * @return {Array} A new array with only passed elements
 */
Utils.filter = function(array, test) {
  var result = []
  for (var i = 0; i < array.length; i++) {
    if (!test(array[i])) {
      result.push(array[i])
    }
  }
  return result;
};

/**
 * Find nearest entity from a list of entities
 * @param {Entity} from Entity
 * @param {Entity[]} entities List of entities to compare
 * @return {Entity} Nearest Entity
 */
Utils.nearest = function(from, entities) {
  for (var i = 0; i < entities.length; i++) {
    var to = entities[i];
    if (from === to) continue;
    var distance = this.distance(from, to);
    if (!nearestDistance || distance < nearestDistance) nearestDistance = distance
  return nearestDistance;
};

/**
 * Returns nearest ship of opposite team
 * @return {Ship} Nearest enemy ship
 */
ENGINE.Ship.prototype.getTarget = function() {
  var pool = [];
  for (var i = 0; i < this.game.entities.length; i++) {
    var entity = this.game.entities[i];
    if (!(entity instanceof ENGINE.Ship)) continue;
    if (entity.team !== this.team) pool.push(entity);
  }
  return Utils.nearest(this, pool);
};

// We update those for positions, maybe we don't need it?
var axes = {
  x: Math.cos,
  y: Math.sin
};

/**
 * Update position for an entity that has speed and direction.
 * @param {Number} direction Angle given in radians
 * @param {Number} value Distance to move
 */
Utils.moveInDirection = function(direction, value) {
  for (var axis in axes) {
    this[axis] += axes[axis](this.direction) * value;
  }
};


/**
 * Update ship position with current direction and speed
 * @param {Number} dt Time delta for current frame in seconds
 */
ENGINE.Ship.prototype.move = function(dt) {
  var direction = 0;
  var value = 0;

  if (!this.frozen) {
    direction += this.direction
    value += this.speed * dt
  }

  if (this.force > 0) {
    this.force -= 200 * dt;
    direction += this.forceDirection
    value += this.force * dt
  }

  if (direction > 0) Utils.moveInDirection.apply(this, [direction, value]);
};

/**
 * Frame step for a particle
 * @param {Number} dt Time delta for current frame in seconds
 */
ENGINE.Particle.prototype.step = function(dt) {
  this.lifetime += dt;
  // Update position
  for (var axis in axes) {
    this[axis] += axes[axis](this.direction) * this.speed * dt;
  }
  this.speed = Math.max(0, this.speed - this.damping * dt);

  this.progress = Math.min(this.lifetime / this.duration, 1.0);
  // Put particle offscreen for pooling and to keep render time constant
  if (this.progress >= 1.0) {
    this.x = 0;
    this.y = 0;
    this.progress = 0;
  }
  // Update index for current sprite to render
  this.spriteIndex = Math.floor(this.progress * this.sprites.length);
}

/**
 * Check if star is in screen boundaries.
 * Otherwise wrap it to the opposite side of screen.
 * @param {Star} star Probed star
 */
ENGINE.BackgroundStars.prototype.wrap = function(star) {
  star.x %= app.width
  star.y %= app.height
};

