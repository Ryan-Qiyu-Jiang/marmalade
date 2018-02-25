var current_best_move=[0,0,0,0];

function minMax(board,isMax){
	
function helper(board, isMax, depth, acc, alpha, beta,max_level){
	// console.log(acc);
	// console.log(board.get_state());
	// board.display();
	if(depth==max_level){
		// if(acc[0]=='p1' &&acc[1].m==4 && acc[2]=='*q' &&acc[3].m==3){
		// 	 console.log(acc);
		// 	 board.display();
		// 	 console.log(board.get_state());
		// }
		return [0,0,board.get_state(), acc];
	}
	let best_move=[0,0,board.get_state(), acc];
		const original=new Board();
		original.init();
		original.set(board);

	if(isMax){
		const pieces = original.you;
		let best_value = -9999999;

		for(let [key,value] of pieces){

			const moves=original.all_moves(key);

			for(let f=0;f<moves.length;f++){

				board.move(key,moves[f]);
				const a=helper(board, !isMax, depth+1, acc.concat([key,moves[f]]),alpha,beta,max_level);
				board.set(original);
				if(best_value<a[2]){
					best_value=a[2];
					best_move=[key,moves[f],best_value, a[3]];
				}
				alpha=Math.max(best_value,alpha);
				if(beta<=alpha){
					break;
				}

			}
			if(beta<=alpha){
				break;
			}
		}

	}else{
		const pieces = board.op;
		let best_value = 9999999;

		for(let [key,value] of pieces){

			const moves=board.all_moves(key);

			for(let f=0;f<moves.length;f++){

				board.move(key,moves[f]);
				const a=helper(board, !isMax, depth+1, acc.concat([key,moves[f]]),alpha,beta,max_level);
				board.set(original);
				if(best_value>a[2]){
					best_value=a[2];
					best_move=[key,moves[f],best_value, a[3]];
				}
				beta=Math.min(best_value,beta);
				if(beta<=alpha){
					break;
				}
			}
			if(beta<=alpha){
				break;
			}	
		}
	}
	return best_move;

}
console.log(board);
//progressive deepening
for(let f=1;f<5;f++){
	setTimeout(function(){
	 current_best_move=helper(board,isMax,0, [],-9999999,9999999,f);
	 console.log("Depth: "+f+" Current Best Move: ");
	 console.log(current_best_move);

	 //update popup text
	 const posn_to_str=function(posn){
	 	return "( "+String.fromCharCode('a'.charCodeAt(0)+posn.n-1)+", "+posn.m+" )";
	 };
	 const posn_str=posn_to_str(current_best_move[1]);

	 let steps='<ul>';
	 const way=current_best_move[3];
	 for(let f=0;f<way.length;f+=2){
	 	steps+='<li>';
	 	steps+=way[f];
	 	steps+=" -> "+posn_to_str(way[f+1]);
	 	steps+='</li>';
	 }
	 steps+='</ul>';

	 const r_div=document.getElementById('response');
     r_div.innerHTML="Depth: "+f+" <br />Hmm try: "+current_best_move[0]+" --> "+posn_str+"<br /> Max Score: "+
     current_best_move[2]+"<br /> Steps: "+steps;

     document.getElementById('content').style.display = 'none';
	 document.getElementById('content').style.display = 'block';

     //display board
	 const b2=new Board();
	 b2.init();
	 b2.set(board);
	 b2.play(current_best_move[3]);
	 b2.display();
	},0);
}

}