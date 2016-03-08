window.onload=function(){

	window.SnakeGame={ 
		// Snake Initialize positon and prototype
		snake:{
				x:100, // x-coordinate
				y:40,  // y-coordinate
				w:20,  // width of each snake cell
				h:20,  // height of each snake cell
				s:5,   // no of snake cell
				d:"R"  //Direction of the snake movement
		}, 
		
		food:{
				x:0,	// x-coordinate	
				y:0,	// y-coordinate
				w:20,	// width of food
				h:20	// height of food
		},  // Food prototype 

		play:"",
		dangle:true, 
		scoreBoard:document.getElementsByClassName('score')[0],
		stop:false,
		images:"",

		/***  Starting the Game  ***/
		startGame:function(){
			this.events.loadImageResource();
			this.events.playGame();
		},

		events:{
			/***  moving the Snake position  ***/
			playGame:function (){
				evts.createSnake(SnakeGame.snake);
				evts.createFood();
					
				SnakeGame.play=window.setInterval(function(){
						
					evts.ClearSnake();
					var newPos=evts.clone(SnakeBody[0]);

					switch(snake.d){
							case "D":
				        		newPos.y+=newPos.h;
				        		break;
				        	case "U":
				        		newPos.y-=newPos.h;		
				        		break;
				        	case "L":
				        		newPos.x-=newPos.w;
				        		break;
				        	case "R":
				        		newPos.x+=newPos.w;
				        		break;
					}

					evts.WallcollisionDetection();
						
					if(!SnakeGame.stop){
						newPos.s=snake.s;
						newPos.d=snake.d;
						SnakeBody.splice(0,0,newPos);
						SnakeBody.pop();
					}

					evts.drawSnake(SnakeBody);		
				},200);
				
			},
			/***  Create and initialize the Snake character  ***/
			createSnake:function(snake){
				var temp = evts.clone(snake);

				for(var i=0;i<temp.s;i++){
					SnakeBody.push(evts.clone(temp));
					temp.x-=temp.w;
				}

				evts.drawSnake(SnakeBody);
			},

			/***  increase the Snake body size  ***/
			growSnake:function (){

				var temp = evts.clone(SnakeBody[SnakeBody.length-1]);
				temp.s=snake.s;

				for(var i=SnakeBody.length;i<temp.s;i++){
					SnakeBody.push(temp);
					temp.x-=temp.w;
				}

				evts.drawSnake(SnakeBody);

			},
			/***  repositon or redraw the snake   ***/
			drawSnake:function(SnakeBody){
	
				evts.collisionDetection();

				evts.drawSnakePart(SnakeBody[0],"head");

				for(var i=(!SnakeGame.stop)?1:2;i<snake.s-1;i++)
					evts.drawSnakePart(SnakeBody[i],"body");

				evts.drawSnakePart(SnakeBody[SnakeBody.length-1],"tail",SnakeBody[SnakeBody.length-2]);		
	
			},
			/***  Generic function to draw snake HEAD,BODY and Tail   ***/
			drawSnakePart:function(pos,parts,lpos){

			    
			   	parts=(parts==="head")?parts+SnakeGame.stop:parts;

			   
			    switch((parts==="tail")?lpos.d:pos.d){
			            case "D":
			             	ctx.drawImage(images[parts][0],pos.x,pos.y);	
			                break;
			            case "U":
			            	ctx.drawImage(images[parts][1],pos.x,pos.y);
			                break;
			            case "L":
			            	ctx.drawImage(images[parts][2],pos.x,pos.y);
			                break;
			            case "R":
			            	ctx.drawImage(images[parts][3],pos.x,pos.y);
			                break;
			    }


			},
			/***  To load the snake Image ***/
			loadImageResource:function(){
				var snakeParts={
			        headtrue:["snakeHeadDownDead","snakeHeadUpDead","snakeHeadLeftDead","snakeHeadRightDead"],
			        headfalse:["snakeHeadDown","snakeHeadUp","snakeHeadLeft","snakeHeadRight"],
			        body:["snakeBodyDown", "snakeBodyUp","snakeBodyLeft","snakeBodyRight"],
			        tail:["snakeTailDown", "snakeTailUp","snakeTailLeft","snakeTailRight"],
			        food:["food"]
			    }
			    
			    images=evts.clone(snakeParts);

			    for(var key in snakeParts)
			    	for(var i in snakeParts[key])
			    	{
			    		var image=new Image();
			    		image.src="images/"+snakeParts[key][i]+".png";
			    		image.width=snake.w;
			   			image.height=snake.h;
			    		images[key][i]=image;
			    	}
			    

			},

			/***  creating the snake's food at random position  ***/
			createFood:function (){
				
				food.x=evts.getRandomInt(canvas.offsetLeft,canvas.offsetWidth);
				food.y=evts.getRandomInt(canvas.offsetTop,canvas.offsetHeight);
				
				for(var i=0;i<SnakeBody.length;i++){
					if(SnakeBody[i].x===food.x && SnakeBody[i].y===food.y)
						evts.createFood();
				}

			  	window.setInterval(function(){
				    	ctx.drawImage(images["food"][0],food.x,food.y);
			  	},250);
			},

			/***  delete the snake from the canvas  ***/
			ClearSnake:function(){
				for(var i in SnakeBody)
					ctx.clearRect(SnakeBody[i].x,SnakeBody[i].y,SnakeBody[i].w,SnakeBody[i].h);
			},
			/***  to detect whether snake collides with the wall ***/
			WallcollisionDetection:function (){
				if(SnakeBody[0].x<0 || SnakeBody[0].x>=canvas.offsetWidth  || SnakeBody[0].y<0 || SnakeBody[0].y>=canvas.offsetHeight)
					evts.stopGame();
			},
			/***  to detect whether snake collides with itself or catch the food ***/
			collisionDetection:function(){
				
				if(SnakeBody[0].x===food.x && SnakeBody[0].y===food.y) {
					evts.createFood();
					snake.s++;
					SnakeGame.scoreBoard.innerHTML=snake.s-5;
					evts.growSnake();

				} else {
					
					for(var i=1;i<snake.s;i++) 
				 		if((SnakeBody[i].x===SnakeBody[0].x) &&  (SnakeBody[i].y===SnakeBody[0].y))
							evts.stopGame();
						
						
				}
				

			},
			/***  stop the game on Gameover ***/
			stopGame:function(){
				clearInterval(SnakeGame.play);
				SnakeBody[0]=SnakeBody[1];
				SnakeGame.stop=true;
				evts.GameOverScreen();
				
			},
			/***  route over to the game Over screen ***/
			GameOverScreen:function(){
				window.setTimeout(function(){
					document.getElementsByClassName('GameOver')[0].style.display="block";
					document.getElementsByClassName('scoreboard')[0].style.display="none";
					document.getElementsByClassName('finalScore')[0].innerHTML=snake.s-5;
				},1000);
			},
			/***  change the direction of the snake ***/
			KeyEvents:function(e){
										
						if((e.keyCode===37) && (SnakeBody[0].d!=="R"))	
								snake.d="L"
						else if((e.keyCode===38) && (SnakeBody[0].d!=="D"))
								snake.d="U"
						else if((e.keyCode===39) && (SnakeBody[0].d!=="L"))
								snake.d="R"
						else if((e.keyCode===40) && (SnakeBody[0].d!=="U"))
								snake.d="D"		
			},
			/***  random no generation between two points ***/
			getRandomInt:function(min, max) {

				   var calc=Math.floor(Math.random() * (max - min + 1))+ min;
				   calc-=(calc%snake.w);
				   return calc;
			},
			/*** clone the snake cell for various parts ***/
			clone:function(obj){
			    
			    if(obj == null || typeof(obj) != 'object')
			        return obj;

			    var temp = obj.constructor(); 

			    for(var key in obj)
			        temp[key] = evts.clone(obj[key]);
			    return temp;
			}
		},
	};

	var SnakeBody=[],
	snake=SnakeGame.snake,
	food=SnakeGame.food,
	score=0,
	canvas=document.getElementById('canvas'),
	ctx=canvas.getContext("2d"),
	evts=SnakeGame.events;


	document.onkeyup=function(e){
		if(e.keyCode>=37 && e.keyCode<=40)
			evts.KeyEvents(e);
	}
	/***  to start the game on click to play button ***/
	document.getElementsByClassName('play')[0].onclick=function(){
		document.getElementsByClassName('shadowLayer')[0].style.display="none";
		document.getElementsByClassName('scoreboard')[0].style.display="block";
		SnakeGame.startGame();
	}
}

