function nextMove(data){
	const board = new Board();
		//get array of moves ["e4", "e6", "Nf3", "d5"]
		const moves=data;
		console.log(moves);
		board.init();
		board.read(moves);
		board.display();
		//do minMax
		minMax(board,true);

}

// const board=new Board();
// board.init();
// const b2=new Board();
// b2.init();

 
//  board.move('p4',new Posn(4,4));
//  board.move('*p5',new Posn(5,5));
//  board.move('*p4',new Posn(4,6));
//  board.move('*p3',new Posn(3,6));
//  board.move('p4',new Posn(5,5));
//  board.move('q',new Posn(7,3));
//  board.move('*b2',new Posn(7,5));
//  board.move('*p6',new Posn(6,6));
//  board.move('*n2',new Posn(4,2));
//  board.move('b2',new Posn(4,2));
//   board.move('n2',new Posn(4,2));
// board.move('*k',new Posn(-1,0));
// board.display();
// console.log(board.all_moves('k'));
//   board.move('q',new Posn(6,7));
//     board.move('p2',new Posn(7,6));
//         board.move('*p4',new Posn(4,6));
//          board.move('b1',new Posn(7,4));
//  board.display();

// console.log(board.is_check('*'));
// console.log(board.is_check(''));


// console.log(board.is_checkmate('*'));
// console.log(board.is_checkmate(''));
// board.move('n1',new Posn(4,5));
// board.display();
// board.move('n1',new Posn(5,7));
 //board.play(['p4',new Posn(4,4),'*p5',new Posn(5,5),'*p4',new Posn(4,6)],'*p3',new Posn(3,6));
 
 // board.display();
 // console.log(board);
 // console.log( board.get_state());

//  board.read(["d4", "d6", "c4", "Nf6", "Nc3", "g6", "Qb3", "c5", "d5", "Qb6"]);

// board.display();

// minMax(board,true);