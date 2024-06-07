import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { ComponentsModule } from './components/components.module';
import { addIcons } from 'ionicons';
import { play, volumeHighOutline, volumeMuteOutline } from 'ionicons/icons'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ComponentsModule ],
})
export class HomePage implements OnInit {

  container_height!: number;
  container_width!: number;

  gameStarted: boolean = false;
  gameOver: boolean = false;

  musicActive: boolean = false;
  audio = new Audio('/assets/music/ionic-bird-track.MP3');  

  score: number = 0;

  bird_height: number = 38;
  bird_width: number = 43;
  bird_position: number = 300;
  bird_interval!: any;

  obstacle_height: number = 0;
  obstacle_width: number = 52;
  obstacle_position: number = this.container_width;
  obstacle_gap: number = 200;
  obstacle_interval!: any;

    constructor(
      private platform: Platform
      ) {
        addIcons({ 
          'play': play,
          'volume-mute-outline': volumeMuteOutline,
          'volume-high-outline': volumeHighOutline
        
        });
      }

  ngOnInit(): void {
    this.setContainerSize();
    this.bird_interval = setInterval(this.addGravity.bind(this), 24);
    this.obstacle_interval = setInterval(this.moveObstacle.bind(this), 24);
  }

  /* container size */
  setContainerSize() {
    this.container_height = this.platform.height();
    this.container_width = this.platform.width() < 576 ? this.platform.width() : 576;
  }

  playMusic(){
    this.musicActive = !this.musicActive
    if (this.musicActive)  {
      this.audio.play()
      this.audio.loop
    } else {
      this.audio.pause()
    }
  }

  /* start game */
  startGame() {
    this.gameStarted = true;
    this.gameOver = false;
    this.score = 0;
  }

  /* gravity */
  addGravity() {
    let gravity = 4.5;
    if (this.gameStarted) this.bird_position += gravity
  }

  /* jump */
  jump() {
    if (this.gameStarted) {
      if (this.bird_position < this.bird_height) this.bird_position = 0
      else this.bird_position -= 60
    }
  }

  /* move obstacle foward */
  moveObstacle() {
    let speed: number = 6;
    if (this.container_width < 400) speed = 4;

    if (this.gameStarted && this.obstacle_position >= -this.obstacle_width) this.obstacle_position -= speed;
    else {
      this.resetObstaclePosition();
      if (this.gameStarted) this.score++;
    }
    
    this.checkCollision()
  }

  /* reset obstacle position */
  resetObstaclePosition() {
    this.obstacle_position = this.container_width;
    this.obstacle_height = Math.floor(Math.random() * (this.container_height - this.obstacle_gap  ))
  }

  /* game over */
  setGameOver() {
    this.gameStarted = false;
    this.gameOver = true;
    this.bird_position = 300;
  }

  /* on colition */
  checkCollision() {
    let top_obstacle_collision = this.bird_position >= 0 && this.bird_position < this.obstacle_height;
    let bottom_obstacle_collision = this.bird_position >= (this.container_height - (this.container_height - this.obstacle_gap - this.obstacle_height) - this.bird_height)
    let floorCollision = (this.bird_position + 40) >= this.container_height;
    if (floorCollision) this.setGameOver()
    if (this.obstacle_position >= this.obstacle_width
      && this.obstacle_position <= this.obstacle_width + 80
      && (top_obstacle_collision || bottom_obstacle_collision)) {
      this.setGameOver()
    }
  }








}
