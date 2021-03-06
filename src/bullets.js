class Bullets {
  constructor() {
    this.bullets = [];
  }
  add(bullet) {
    this.bullets.push(bullet);
  }
  next() {
    let collision = 0;
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      if (bullet.x + bullet.w < 1) {
        this.bullets.splice(i, 1);
        i -= 1;
        continue;
      }
      bullet.update();
      bullet.show();
      collision += isColliding(bullet, character, COLLISION_BOUNDARY) ? 1 : 0;
    }
    return collision === 0;
  }
  clear() {
    this.bullets = [];
  }
}

class Bullet {
  constructor(x, y, w, h, xs, ys) {
    this.w = w || BULLET_WIDTH;
    this.h = h || BULLET_HEIGHT;
    this.x = x || width;
    this.y = y || height / 2;
    this.xspeed = xs || -INIT_BULLET_MIN_SPEED * bulletSpeedRate;
    this.yspeed = ys || 0;
  }
  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  // draw bullet
  show() {
    image(bulletImg, this.x, this.y, this.w, this.h);
  }
}

class FatalBullet extends Bullet {
  constructor(rate) {
    super();
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.y = character ? character.y : random(this.h / 2, height - this.h / 2);
    this.xspeed = this.xspeed * rate;
    this.yspeed = character ? character.yspeed : 0;
  }

  update() {
    this.x += 2 * this.xspeed;
    this.y += this.yspeed;

    // map boundary = 1
    if (this.y + this.h > height - 1) {
      this.y = height - 1 - this.h;
      this.yspeed = -this.yspeed;
    }
    if (this.y < 1) {
      this.y = 1;
      this.yspeed = -this.yspeed;
    }
  }
}

// stopper
class Stopper extends Bullet {
  constructor(block) {
    super();
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.y = random(this.h / 2, height - this.h / 2);
    this.yspeed = 0;
    this.block = block;
  }

  update() {
    if (
      this.x + this.w / 2 >= character.x &&
      this.x + this.w / 2 <= character.x + character.w &&
      this.block > 0
    ) {
      this.block -= 1;
    } else {
      this.x += this.xspeed;
    }
    this.y += this.yspeed;
  }
  show() {
    image(bulletRImg, this.x, this.y, this.w, this.h);
  }
}

class Vanisher extends Bullet {
  constructor() {
    super();
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.y = random(this.h / 2, height - this.h / 2);
    this.xspeed = 2 * this.xspeed;
    this.yspeed = 0;
    this.tint = 255;
  }

  update() {
    if (this.x / width < 0.9 && this.tint >= 0) {
      this.tint -= 10;
    }
    if (this.x / width < 0.4 && this.tint <= 255) {
      this.tint += 20;
    }
    this.x += this.xspeed;
    this.y += this.yspeed;
  }
  show() {
    tint(255, this.tint);
    image(bulletGImg, this.x, this.y, this.w, this.h);
    tint(255, 255);
  }
}

class Randomer extends Bullet {
  constructor() {
    super();
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.y = random(this.h / 2, height - this.h / 2);
    this.xspeed = 1.7 * this.xspeed;
    this.yspeed = 0;
  }

  update() {
    if (this.x > width * 0.5 && scoreCount % 15 === 0) {
      this.y = random(this.h / 2, height - this.h / 2);
    }
    this.x += this.xspeed;
    this.y += this.yspeed;
  }
  show() {
    image(bulletGImg, this.x, this.y, this.w, this.h);
  }
}

class Accelerator extends Bullet {
  constructor(a) {
    super();
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.y = random(this.h / 2, height - this.h / 2);
    this.yspeed = 0;
    this.a = a;
  }

  update() {
    if (this.x < width / 2) {
      this.xspeed -= this.a;
      if (this.x < width / 3) {
        this.xspeed -= this.a;
      }
    }
    this.x += this.xspeed;
    this.y += this.yspeed;
  }
  show() {
    image(bulletRImg, this.x, this.y, this.w, this.h);
  }
}

class Plumber extends Bullet {
  constructor() {
    super();
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.x = character.x;
    this.y = character.y > height / 2 ? height : 0 - this.h;
    this.yspeed = character.y > height / 2 ? -2 : 2;
    this.xspeed = -5;
  }

  update() {
    if (this.y < height / 3 || this.y > (height / 3) * 2) {
      this.y += this.yspeed;
    } else {
      this.x += this.xspeed;
    }
  }
  show() {
    image(bulletRImg, this.x, this.y, this.w, this.h);
  }
}

class Crosser extends Bullet {
  constructor() {
    super();
    this.w = BULLET_WIDTH + 10;
    this.h = BULLET_HEIGHT + 10;
    this.y = random(this.h / 2, height - this.h / 2);
    if (this.y > height / 2) {
      this.y += height / 2;
      this.yspeed = -Math.abs(character.yspeed);
    } else {
      this.y -= height / 2;
      this.yspeed = Math.abs(character.yspeed);
    }
    this.xspeed = this.xspeed * 1.3;
  }

  update() {
    this.y += this.yspeed;
    this.x += this.xspeed;
  }
  show() {
    image(bulletPImg, this.x, this.y, this.w, this.h);
  }
}
