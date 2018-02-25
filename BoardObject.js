function Posn(n,m){
	this.n=n;
	this.m=m;
}
const pawn_table=	
	[[0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
     [5,  5, 10, 27, 27, 10,  5,  5],
     [0,  0,  0, 25, 25,  0,  0,  0],
     [5, -5,-10,  0,  0,-10, -5,  5],
     [5, 10, 10,-25,-25, 10, 10,  5],
     [0,  0,  0,  0,  0,  0,  0,  0]];

const knight_table=
    [[-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-20,-30,-30,-20,-40,-50]];

const bishop_table=
    [[-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-40,-10,-10,-40,-10,-20]];

function Board(){
	this.you=new Map();
	this.op=new Map();
	this.field=[];
	this.piece_count=0;
	this.is_max=true;
	// moved king, r1, r2
	this.you_moved=[false,false,false];
	// moved king, r1, r2
	this.op_moved=[false,false,false];
	this.you_castled=false;
	this.op_castled=false;
}

Board.prototype={
	constructor:Board,
	init:function(){
		for(let f=1;f<=8;f++){
			this.you.set('p'+f,new Posn(f,2));
			this.op.set('*p'+f,new Posn(f,7));
		}
		this.you.set('k',new Posn(5,1));
		this.op.set('*k',new Posn(5,8));

		this.you.set('q',new Posn(4,1));
		this.op.set('*q',new Posn(4,8));

		this.you.set('b1',new Posn(6,1));
		this.op.set('*b1',new Posn(6,8));
		this.you.set('b2',new Posn(3,1));
		this.op.set('*b2',new Posn(3,8));

		this.you.set('n1',new Posn(7,1));
		this.op.set('*n1',new Posn(7,8));
		this.you.set('n2',new Posn(2,1));
		this.op.set('*n2',new Posn(2,8));

		this.you.set('r1',new Posn(8,1));
		this.op.set('*r1',new Posn(8,8));
		this.you.set('r2',new Posn(1,1));
		this.op.set('*r2',new Posn(1,8));

		this.field=[
		new Array(9),
		[null,'r2','n2','b2','q','k','b1','n1','r1'],
		[null,'p1','p2','p3','p4','p5','p6','p7','p8'],
		new Array(9),
		new Array(9),
		new Array(9),
		new Array(9),
		[null,'*p1','*p2','*p3','*p4','*p5','*p6','*p7','*p8'],
		[null,'*r2','*n2','*b2','*q','*k','*b1','*n1','*r1']
		];
	},
	display:function(){
		for(let f=8;f>0;f--){
			let s='';
			for(let a=1;a<=8;a++){
				let b=this.field[f][a];
				if(b==null){
					s+='___';
				}else{
					if(b.length==1){
						b=' '+b+' ';
					}else if(b.length==2){
						b+=' ';
					}
					s+=b;
				}
				s+=' ';
			}
			console.log(s);
		}
		console.log(".");
	},
	get:function(key){
		if(key[0]=='*'){
			return this.op.get(key);
		}
		return this.you.get(key);
	},
	set:function(b){
		this.you= new Map(b.you);
		this.op=new Map(b.op);
		this.field=b.field.map((arr)=>{
			return arr.slice(0);
		});
		this.piece_count=b.piece_count;
		this.op_moved=b.op_moved.slice(0);
		this.op_castled=b.op_castled;
		this.you_moved=b.you_moved.slice(0);
		this.you_castled=b.you_castled;
	},
	move:function(key,p){
		let temp;

		//castling
		const k=(key[0]=='*')?key.slice(1):key;
		if(k=='k'&&p.n==0){
			if(key[0]=='*'){
				this.op.set('*k',new Posn(7,8));
				this.op.set('*r1',new Posn(6,8));
				this.field[8][7]='*k';
				this.field[8][6]='*r1';
				this.field[8][8]=null;
				this.field[8][5]=null;
				this.op_moved[0]=true;
				this.op_moved[1]=true;
				this.op_castled=true;
			}else{
				this.you.set('k',new Posn(7,1));
				this.you.set('r1',new Posn(6,1));
				this.field[1][7]='k';
				this.field[1][6]='r1';
				this.field[1][8]=null;
				this.field[1][5]=null;
				this.you_moved[0]=true;
				this.you_moved[1]=true;
				this.you_castled=true;
			}
			return;
		}else if(k=='k'&&p.n==-1){
			if(key[0]=='*'){
				this.op.set('*k',new Posn(2,8));
				this.op.set('*r2',new Posn(3,8));
				this.field[8][2]='*k';
				this.field[8][3]='*r2';
				this.field[8][1]=null;
				this.field[8][5]=null;
				this.op_moved[0]=true;
				this.op_moved[2]=true;
				this.op_castled=true;
			}else{
				this.you.set('k',new Posn(2,1));
				this.you.set('r2',new Posn(3,1));
				this.field[1][2]='k';
				this.field[1][3]='r2';
				this.field[1][1]=null;
				this.field[1][5]=null;
				this.you_moved[0]=true;
				this.you_moved[2]=true;
				this.you_castled=true;
			}
			return;
		}
		if(key=='*r1'){
			this.op_moved[1]=true;
		}else if(key=='*r2'){
			this.op_moved[2]=true;
		}else if(key=='*k'){
			this.op_moved[0]=true;
		}else if(key=='r1'){
			this.you_moved[1]=true;
		}else if(key=='r2'){
			this.you_moved[2]=true;
		}else if(key=='k'){
			this.you_moved[0]=true;
		}

		if(key[0]=='*'){
			temp=this.op.get(key);
			this.op.set(key,p);
		}else{
			temp=this.you.get(key);
			this.you.set(key,p);
		}

		if(this.field[p.m][p.n]!=null){
			let key2=this.field[p.m][p.n];
			if(key2[0]=='*'){
				this.op.delete(key2);
				this.piece_count+=this.value_of(key2);
			}else{
				this.you.delete(key2);
				this.piece_count-=this.value_of(key2);
			}
		}

		if(temp==null){temp=this.you.get(key);}
		this.field[temp.m][temp.n]=null;
		this.field[p.m][p.n]=key;
		this.is_max=(!this.is_max);
	},
	get_team:function(side){
		if(side=='*'){
			return Object.assign({},this.op);
		}else{
			return Object.assign({},this.you);
		}
	},
	//returns list of moves where you cannot eat king, and respects check
	all_moves:function(key){
		const player = (key[0]=='*')?'*':'';
		const op_moves=(key)=>{
			const moves=[];
			const k=key.substring(1);
			const a=this.op.get(key);
			if(a==null){
				console.log("can't find "+key+" in evil.");
			}
			const n=a.n;
			const m=a.m;
			const is_free=function(v){
				return (v==null || (v[0]!='*' && v[0]!='k'));
			};
			const is_evil=function(v){
				return v!=null && (v[0]!='*' && v[0]!='k');
			};
			const move_add = (posn)=>{
				let exception=false;
				if(key=='*k'&&posn.n<1){
					exception=true;
				}
					const future = new Board();
					future.set(this);
					future.move(key,posn);
					if(!future.is_check(player)){
						if(exception||(this.field[posn.m][posn.n]!='*k'&&this.field[posn.m][posn.n]!='k')){
							moves.push(posn);
						}
					}
			};
			const castle_moves=()=>{
					if(!this.op_moved[0]){
						if(!this.op_moved[1]&&this.field[8][6]==null&&this.field[8][7]==null){
							move_add(new Posn(0,0));
						}
						if(!this.op_moved[2]&&this.field[8][4]==null&&this.field[8][3]==null&&this.field[8][2]==null){
							move_add(new Posn(-1,0));
						}
					}
			};
			const r_moves=()=>{
				let f=1;
				//right
				while(n+f<=8 && is_free(this.field[m][n+f])){
					move_add(new Posn(n+f,m));
					if(is_evil(this.field[m][n+f]) ){
						break;
					}
					f++;
				}
				f=1;
				//left
				while(n-f>=1 && is_free(this.field[m][n-f]) ){
					move_add(new Posn(n-f,m));
					if(is_evil(this.field[m][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				//up
				while(m+f<=8 && is_free(this.field[m+f][n]) ){
					move_add(new Posn(n,m+f));
					if(is_evil(this.field[m+f][n]) ){
						break;
					}
					f++;
				}
				f=1;
				//down
				while(m-f>=1 && is_free(this.field[m-f][n]) ){
					move_add(new Posn(n,m-f));
					if(is_evil(this.field[m-f][n])){
						break;
					}
					f++;
				}
			};

			const b_moves=()=>{
				let f=1;
				//  ^>
				while(m+f<=8 &&n+f<=8 && is_free(this.field[m+f][n+f]) ){
					move_add(new Posn(n+f,m+f));
					if(is_evil(this.field[m+f][n+f]) ){
						break;
					}
					f++;
				}
				f=1;
				// <^
				while(n-f>=1 && m+f<=8 && is_free(this.field[m+f][n-f]) ){
					move_add(new Posn(n-f,m+f));
					if(is_evil(this.field[m+f][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				// <v
				while(m-f>=1 && n-f>=1 && is_free(this.field[m-f][n-f]) ){
					move_add(new Posn(n-f,m-f));
					if(is_evil(this.field[m-f][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				// v>
				while(m-f>=1 && n+f<=8 && is_free(this.field[m-f][n+f]) ){
					move_add(new Posn(n+f,m-f));
					if(is_evil(this.field[m-f][n+f]) ){
						break;
					}
					f++;
				}
			};

			if(k[0]=='p'){
				// down
				if(m-1>=0 && this.field[m-1][n]==null){
					move_add(new Posn(n,m-1));
				}
				// down right eat
				if(m-1>=1 && n<8 && is_evil(this.field[m-1][n+1])){
					move_add(new Posn(n+1,m-1));
				}
				// down left eat
				if(m-1>=1 && n>1 && is_evil(this.field[m-1][n-1])){
					move_add(new Posn(n-1,m-1));
				}
				// magic leap
				if(m==7 && this.field[m-1][n]==null && this.field[m-2][n]==null){
					move_add(new Posn(n,m-2));
				}

			}else if(k[0]=='r'){
				r_moves();
			}else if(k[0]=='b'){
				b_moves();
			}else if(k[0]=='n'){
				// <vv  m-2 n-1
				if(m-2>=1 && n-1>=1 && is_free(this.field[m-2][n-1]) ){
					move_add(new Posn(n-1,m-2));
				}
				// vv>  m-2 n+1
				if(m-2>=1 && n+1<=8 && is_free(this.field[m-2][n+1]) ){
					move_add(new Posn(n+1,m-2));
				}
				// <^^  m+2 n-1
				if(m+2<=8 && n-1>=1 && is_free(this.field[m+2][n-1]) ){
					move_add(new Posn(n-1,m+2));
				}
				// ^^>  m+2 n+1
				if(m+2<=8 && n+1<=8 && is_free(this.field[m+2][n+1]) ){
					move_add(new Posn(n+1,m+2));
				}
				// >>^  m+1 n+2
				if(m+1<=8 && n+2<=8 && is_free(this.field[m+1][n+2]) ){
					move_add(new Posn(n+2,m+1));
				}
				// >>v  m-1 n+2
				if(m-1>=1 && n+2<=8 && is_free(this.field[m-1][n+2]) ){
					move_add(new Posn(n+2,m-1));
				}
				// <<^  m+1 n-2
				if(m+1<=8 && n-2>=1 && is_free(this.field[m+1][n-2]) ){
					move_add(new Posn(n-2,m+1));
				}
				// <<v  m-1 n-2
				if(m-1>=1 && n-2>=1 && is_free(this.field[m-1][n-2]) ){
					move_add(new Posn(n-2,m-1));
				}

			}else if(k=='k'){
				castle_moves();
				// <vv  m-1 n-1
				if(m-1>=1 && n-1>=1 && is_free(this.field[m-1][n-1]) ){
					move_add(new Posn(n-1,m-1));
				}
				// vv>  m-1 n
				if(m-1>=1 && is_free(this.field[m-1][n]) ){
					move_add(new Posn(n,m-1));
				}
				// <^^  m-1 n+1
				if(m-1>=1 && n+1<=8 && is_free(this.field[m-1][n+1]) ){
					move_add(new Posn(n+1,m-1));
				}
				// ^^>  m n+1
				if(n+1<=8 && is_free(this.field[m][n+1]) ){
					move_add(new Posn(n+1,m));
				}
				// >>^  m n-1
				if(n-1>=1 && is_free(this.field[m][n-1]) ){
					move_add(new Posn(n-1,m));
				}
				// >>v  m+1 n+1
				if(m+1<=8 && n+1<=8 && is_free(this.field[m+1][n+1]) ){
					move_add(new Posn(n+1,m+1));
				}
				// <<^  m+1 n-1
				if(m+1<=8 && n-1>=1 && is_free(this.field[m+1][n-1]) ){
					move_add(new Posn(n-1,m+1));
				}
				// <<v  m+1 n
				if(m+1<=8 && is_free(this.field[m+1][n]) ){
					move_add(new Posn(n,m+1));
				}
			}else if(k=='q'){
				r_moves();
				b_moves();
			}
			return moves;
		};
		//returns move list cannot eat king
		const you_moves=(k)=>{
			const moves=[];
			const a=this.you.get(k);
			if(a==null){
				console.log("can't find "+key+" in your pieces.");
			}
			const n=a.n;
			const m=a.m;
			const is_free=function(v){
				return (v==null || (v[0]=='*' && v[1]!='k'));
			};
			const is_evil=function(v){
				return v!=null && (v[0]=='*' && v[1]!='k');
			};
			const move_add = (posn)=>{
				let exception=false;
				if(key=='k'&&posn.n<1){
					exception=true;
				}
					const future = new Board();
					future.set(this);
					future.move(key,posn);
					if(!future.is_check(player)){
						if(exception||(this.field[posn.m][posn.n]!='*k'&&this.field[posn.m][posn.n]!='k')){
							moves.push(posn);
						}
					}
			};
			const castle_moves=()=>{
				if(!this.you_moved[0]){
					if(!this.you_moved[1]&&this.field[1][6]==null&&this.field[1][7]==null){
						move_add(new Posn(0,0));
					}
					if(!this.you_moved[2]&&this.field[1][4]==null&&this.field[1][3]==null&&this.field[1][2]==null){
						move_add(new Posn(-1,0));
					}
				}
			};
			const r_moves=()=>{
				let f=1;
				//right
				while(n+f<=8 && is_free(this.field[m][n+f])){
					move_add(new Posn(n+f,m));
					if(is_evil(this.field[m][n+f]) ){
						break;
					}
					f++;
				}
				f=1;
				//left
				while(n-f>=1 && is_free(this.field[m][n-f]) ){
					move_add(new Posn(n-f,m));
					if(is_evil(this.field[m][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				//up
				while(m+f<=8 && is_free(this.field[m+f][n]) ){
					move_add(new Posn(n,m+f));
					if(is_evil(this.field[m+f][n]) ){
						break;
					}
					f++;
				}
				f=1;
				//down
				while(m-f>=1 && is_free(this.field[m-f][n]) ){
					move_add(new Posn(n,m-f));
					if(is_evil(this.field[m-f][n])){
						break;
					}
					f++;
				}
			};

			const b_moves=()=>{
				let f=1;
				//  ^>
				while(m+f<=8 &&n+f<=8 && is_free(this.field[m+f][n+f]) ){
					move_add(new Posn(n+f,m+f));
					if(is_evil(this.field[m+f][n+f]) ){
						break;
					}
					f++;
				}
				f=1;
				// <^
				while(n-f>=1 && m+f<=8 && is_free(this.field[m+f][n-f]) ){
					move_add(new Posn(n-f,m+f));
					if(is_evil(this.field[m+f][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				// <v
				while(m-f>=1 && n-f>=1 && is_free(this.field[m-f][n-f]) ){
					move_add(new Posn(n-f,m-f));
					if(is_evil(this.field[m-f][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				// v>
				while(m-f>=1 && n+f<=8 && is_free(this.field[m-f][n+f]) ){
					move_add(new Posn(n+f,m-f));
					if(is_evil(this.field[m-f][n+f]) ){
						break;
					}
					f++;
				}
			};

			if(k[0]=='p'){
				// up
				if(m<8 && this.field[m+1][n]==null){
					move_add(new Posn(n,m+1));
				}
				// up right eat
				if(m<8 && n<8 && this.field[m+1][n+1]!=null && this.field[m+1][n+1][0]=='*'){
					move_add(new Posn(n+1,m+1));
				}
				// up left eat
				if(m<8 && n>1 && this.field[m+1][n-1]!=null && this.field[m+1][n-1][0]=='*'){
					move_add(new Posn(n-1,m+1));
				}
				// magic leap
				if(m==2 && this.field[m+1][n]==null && this.field[m+2][n]==null){
					move_add(new Posn(n,m+2));
				}

			}else if(k[0]=='r'){
				r_moves();
			}else if(k[0]=='b'){
				b_moves();
			}else if(k[0]=='n'){
				// <vv  m-2 n-1
				if(m-2>=1 && n-1>=1 && is_free(this.field[m-2][n-1]) ){
					move_add(new Posn(n-1,m-2));
				}
				// vv>  m-2 n+1
				if(m-2>=1 && n+1<=8 && is_free(this.field[m-2][n+1]) ){
					move_add(new Posn(n+1,m-2));
				}
				// <^^  m+2 n-1
				if(m+2<=8 && n-1>=1 && is_free(this.field[m+2][n-1]) ){
					move_add(new Posn(n-1,m+2));
				}
				// ^^>  m+2 n+1
				if(m+2<=8 && n+1<=8 && is_free(this.field[m+2][n+1]) ){
					move_add(new Posn(n+1,m+2));
				}
				// >>^  m+1 n+2
				if(m+1<=8 && n+2<=8 && is_free(this.field[m+1][n+2]) ){
					move_add(new Posn(n+2,m+1));
				}
				// >>v  m-1 n+2
				if(m-1>=1 && n+2<=8 && is_free(this.field[m-1][n+2]) ){
					move_add(new Posn(n+2,m-1));
				}
				// <<^  m+1 n-2
				if(m+1<=8 && n-2>=1 && is_free(this.field[m+1][n-2]) ){
					move_add(new Posn(n-2,m+1));
				}
				// <<v  m-1 n-2
				if(m-1>=1 && n-2>=1 && is_free(this.field[m-1][n-2]) ){
					move_add(new Posn(n-2,m-1));
				}

			}else if(k=='k'){
				castle_moves();
				// <vv  m-1 n-1
				if(m-1>=1 && n-1>=1 && is_free(this.field[m-1][n-1]) ){
					move_add(new Posn(n-1,m-1));
				}
				// vv>  m-1 n
				if(m-1>=1 && is_free(this.field[m-1][n]) ){
					move_add(new Posn(n,m-1));
				}
				// <^^  m-1 n+1
				if(m-1>=1 && n+1<=8 && is_free(this.field[m-1][n+1]) ){
					move_add(new Posn(n+1,m-1));
				}
				// ^^>  m n+1
				if(n+1<=8 && is_free(this.field[m][n+1]) ){
					move_add(new Posn(n+1,m));
				}
				// >>^  m n-1
				if(n-1>=1 && is_free(this.field[m][n-1]) ){
					move_add(new Posn(n-1,m));
				}
				// >>v  m+1 n+1
				if(m+1<=8 && n+1<=8 && is_free(this.field[m+1][n+1]) ){
					move_add(new Posn(n+1,m+1));
				}
				// <<^  m+1 n-1
				if(m+1<=8 && n-1>=1 && is_free(this.field[m+1][n-1]) ){
					move_add(new Posn(n-1,m+1));
				}
				// <<v  m+1 n
				if(m+1<=8 && is_free(this.field[m+1][n]) ){
					move_add(new Posn(n,m+1));
				}
			}else if(k=='q'){
				r_moves();
				b_moves();
			}
			return moves;
		};
		if(key[0]=='*'){
			return op_moves(key);
		}else{
			return you_moves(key);
		}
	},
	//returns move list where you can eat king
	imagine_moves:function(key,posn){

		const op_moves=(key)=>{
			const moves=[];
			const k=key.substring(1);
			const n=posn.n;
			const m=posn.m;
			const is_free=function(v){
				return (v==null || v[0]!='*');
			};
			const is_evil=function(v){
				return v!=null && v[0]!='*';
			};
			const r_moves=()=>{
				let f=1;
				//right
				while(n+f<=8 && is_free(this.field[m][n+f])){
					moves.push(new Posn(n+f,m));
					if(is_evil(this.field[m][n+f]) ){
						break;
					}
					f++;
				}
				f=1;
				//left
				while(n-f>=1 && is_free(this.field[m][n-f]) ){
					moves.push(new Posn(n-f,m));
					if(is_evil(this.field[m][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				//up
				while(m+f<=8 && is_free(this.field[m+f][n]) ){
					moves.push(new Posn(n,m+f));
					if(is_evil(this.field[m+f][n]) ){
						break;
					}
					f++;
				}
				f=1;
				//down
				while(m-f>=1 && is_free(this.field[m-f][n]) ){
					moves.push(new Posn(n,m-f));
					if(is_evil(this.field[m-f][n])){
						break;
					}
					f++;
				}
			};

			const b_moves=()=>{
				let f=1;
				//  ^>
				while(m+f<=8 &&n+f<=8 && is_free(this.field[m+f][n+f]) ){
					moves.push(new Posn(n+f,m+f));
					if(is_evil(this.field[m+f][n+f]) ){
						break;
					}
					f++;
				}
				f=1;
				// <^
				while(n-f>=1 && m+f<=8 && is_free(this.field[m+f][n-f]) ){
					moves.push(new Posn(n-f,m+f));
					if(is_evil(this.field[m+f][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				// <v
				while(m-f>=1 && n-f>=1 && is_free(this.field[m-f][n-f]) ){
					moves.push(new Posn(n-f,m-f));
					if(is_evil(this.field[m-f][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				// v>
				while(m-f>=1 && n+f<=8 && is_free(this.field[m-f][n+f]) ){
					moves.push(new Posn(n+f,m-f));
					if(is_evil(this.field[m-f][n+f]) ){
						break;
					}
					f++;
				}
			};

			if(k[0]=='p'){
				// down
				if(m-1>=0 && this.field[m-1][n]==null){
					moves.push(new Posn(n,m-1));
				}
				// down right eat
				if(m-1>=1 && n<8 && is_evil(this.field[m-1][n+1]) ){
					moves.push(new Posn(n+1,m-1));
				}
				// down left eat
				if(m-1>=1 && n>1 && is_evil(this.field[m-1][n-1]) ){
					moves.push(new Posn(n-1,m-1));
				}
				// magic leap
				if(m==7 && this.field[m-1][n]==null && this.field[m-2][n]==null){
					moves.push(new Posn(n,m-2));
				}

			}else if(k[0]=='r'){
				r_moves();
			}else if(k[0]=='b'){
				b_moves();
			}else if(k[0]=='n'){
				// <vv  m-2 n-1
				if(m-2>=1 && n-1>=1 && is_free(this.field[m-2][n-1]) ){
					moves.push(new Posn(n-1,m-2));
				}
				// vv>  m-2 n+1
				if(m-2>=1 && n+1<=8 && is_free(this.field[m-2][n+1]) ){
					moves.push(new Posn(n+1,m-2));
				}
				// <^^  m+2 n-1
				if(m+2<=8 && n-1>=1 && is_free(this.field[m+2][n-1]) ){
					moves.push(new Posn(n-1,m+2));
				}
				// ^^>  m+2 n+1
				if(m+2<=8 && n+1<=8 && is_free(this.field[m+2][n+1]) ){
					moves.push(new Posn(n+1,m+2));
				}
				// >>^  m+1 n+2
				if(m+1<=8 && n+2<=8 && is_free(this.field[m+1][n+2]) ){
					moves.push(new Posn(n+2,m+1));
				}
				// >>v  m-1 n+2
				if(m-1>=1 && n+2<=8 && is_free(this.field[m-1][n+2]) ){
					moves.push(new Posn(n+2,m-1));
				}
				// <<^  m+1 n-2
				if(m+1<=8 && n-2>=1 && is_free(this.field[m+1][n-2]) ){
					moves.push(new Posn(n-2,m+1));
				}
				// <<v  m-1 n-2
				if(m-1>=1 && n-2>=1 && is_free(this.field[m-1][n-2]) ){
					moves.push(new Posn(n-2,m-1));
				}

			}else if(k=='k'){
				// <vv  m-1 n-1
				if(m-1>=1 && n-1>=1 && is_free(this.field[m-1][n-1]) ){
					moves.push(new Posn(n-1,m-1));
				}
				// vv>  m-1 n
				if(m-1>=1 && is_free(this.field[m-1][n]) ){
					moves.push(new Posn(n,m-1));
				}
				// <^^  m-1 n+1
				if(m-1>=1 && n+1<=8 && is_free(this.field[m-1][n+1]) ){
					moves.push(new Posn(n+1,m-1));
				}
				// ^^>  m n+1
				if(n+1<=8 && is_free(this.field[m][n+1]) ){
					moves.push(new Posn(n+1,m));
				}
				// >>^  m n-1
				if(n-1>=1 && is_free(this.field[m][n-1]) ){
					moves.push(new Posn(n-1,m));
				}
				// >>v  m+1 n+1
				if(m+1<=8 && n+1<=8 && is_free(this.field[m+1][n+1]) ){
					moves.push(new Posn(n+1,m+1));
				}
				// <<^  m+1 n-1
				if(m+1<=8 && n-1>=1 && is_free(this.field[m+1][n-1]) ){
					moves.push(new Posn(n-1,m+1));
				}
				// <<v  m+1 n
				if(m+1<=8 && is_free(this.field[m+1][n]) ){
					moves.push(new Posn(n,m+1));
				}
			}else if(k=='q'){
				r_moves();
				b_moves();
			}
			return moves;
		};
		const you_moves=(k)=>{
			const moves=[];
			const n=posn.n;
			const m=posn.m;
			const is_free=function(v){
				return (v==null || v[0]=='*');
			};
			const is_evil=function(v){
				return v!=null && v[0]=='*';
			};
			const r_moves=()=>{
				let f=1;
				//right
				while(n+f<=8 && is_free(this.field[m][n+f])){
					moves.push(new Posn(n+f,m));
					if(is_evil(this.field[m][n+f]) ){
						break;
					}
					f++;
				}
				f=1;
				//left
				while(n-f>=1 && is_free(this.field[m][n-f]) ){
					moves.push(new Posn(n-f,m));
					if(is_evil(this.field[m][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				//up
				while(m+f<=8 && is_free(this.field[m+f][n]) ){
					moves.push(new Posn(n,m+f));
					if(is_evil(this.field[m+f][n]) ){
						break;
					}
					f++;
				}
				f=1;
				//down
				while(m-f>=1 && is_free(this.field[m-f][n]) ){
					moves.push(new Posn(n,m-f));
					if(is_evil(this.field[m-f][n])){
						break;
					}
					f++;
				}
			};

			const b_moves=()=>{
				let f=1;
				//  ^>
				while(m+f<=8 &&n+f<=8 && is_free(this.field[m+f][n+f]) ){
					moves.push(new Posn(n+f,m+f));
					if(is_evil(this.field[m+f][n+f]) ){
						break;
					}
					f++;
				}
				f=1;
				// <^
				while(n-f>=1 && m+f<=8 && is_free(this.field[m+f][n-f]) ){
					moves.push(new Posn(n-f,m+f));
					if(is_evil(this.field[m+f][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				// <v
				while(m-f>=1 && n-f>=1 && is_free(this.field[m-f][n-f]) ){
					moves.push(new Posn(n-f,m-f));
					if(is_evil(this.field[m-f][n-f]) ){
						break;
					}
					f++;
				}
				f=1;
				// v>
				while(m-f>=1 && n+f<=8 && is_free(this.field[m-f][n+f]) ){
					moves.push(new Posn(n+f,m-f));
					if(is_evil(this.field[m-f][n+f]) ){
						break;
					}
					f++;
				}
			};

			if(k[0]=='p'){
				// up
				if(m<8 && this.field[m+1][n]==null){
					moves.push(new Posn(n,m+1));
				}
				// up right eat
				if(m<8 && n<8 && this.field[m+1][n+1]!=null && this.field[m+1][n+1][0]=='*'){
					moves.push(new Posn(n+1,m+1));
				}
				// up left eat
				if(m<8 && n>1 && this.field[m+1][n-1]!=null && this.field[m+1][n-1][0]=='*'){
					moves.push(new Posn(n-1,m+1));
				}
				// magic leap
				if(m==2 && this.field[m+1][n]==null && this.field[m+2][n]==null){
					moves.push(new Posn(n,m+2));
				}

			}else if(k[0]=='r'){
				r_moves();
			}else if(k[0]=='b'){
				b_moves();
			}else if(k[0]=='n'){
				// <vv  m-2 n-1
				if(m-2>=1 && n-1>=1 && is_free(this.field[m-2][n-1]) ){
					moves.push(new Posn(n-1,m-2));
				}
				// vv>  m-2 n+1
				if(m-2>=1 && n+1<=8 && is_free(this.field[m-2][n+1]) ){
					moves.push(new Posn(n+1,m-2));
				}
				// <^^  m+2 n-1
				if(m+2<=8 && n-1>=1 && is_free(this.field[m+2][n-1]) ){
					moves.push(new Posn(n-1,m+2));
				}
				// ^^>  m+2 n+1
				if(m+2<=8 && n+1<=8 && is_free(this.field[m+2][n+1]) ){
					moves.push(new Posn(n+1,m+2));
				}
				// >>^  m+1 n+2
				if(m+1<=8 && n+2<=8 && is_free(this.field[m+1][n+2]) ){
					moves.push(new Posn(n+2,m+1));
				}
				// >>v  m-1 n+2
				if(m-1>=1 && n+2<=8 && is_free(this.field[m-1][n+2]) ){
					moves.push(new Posn(n+2,m-1));
				}
				// <<^  m+1 n-2
				if(m+1<=8 && n-2>=1 && is_free(this.field[m+1][n-2]) ){
					moves.push(new Posn(n-2,m+1));
				}
				// <<v  m-1 n-2
				if(m-1>=1 && n-2>=1 && is_free(this.field[m-1][n-2]) ){
					moves.push(new Posn(n-2,m-1));
				}

			}else if(k=='k'){
				// <vv  m-1 n-1
				if(m-1>=1 && n-1>=1 && is_free(this.field[m-1][n-1]) ){
					moves.push(new Posn(n-1,m-1));
				}
				// vv>  m-1 n
				if(m-1>=1 && is_free(this.field[m-1][n]) ){
					moves.push(new Posn(n,m-1));
				}
				// <^^  m-1 n+1
				if(m-1>=1 && n+1<=8 && is_free(this.field[m-1][n+1]) ){
					moves.push(new Posn(n+1,m-1));
				}
				// ^^>  m n+1
				if(n+1<=8 && is_free(this.field[m][n+1]) ){
					moves.push(new Posn(n+1,m));
				}
				// >>^  m n-1
				if(n-1>=1 && is_free(this.field[m][n-1]) ){
					moves.push(new Posn(n-1,m));
				}
				// >>v  m+1 n+1
				if(m+1<=8 && n+1<=8 && is_free(this.field[m+1][n+1]) ){
					moves.push(new Posn(n+1,m+1));
				}
				// <<^  m+1 n-1
				if(m+1<=8 && n-1>=1 && is_free(this.field[m+1][n-1]) ){
					moves.push(new Posn(n-1,m+1));
				}
				// <<v  m+1 n
				if(m+1<=8 && is_free(this.field[m+1][n]) ){
					moves.push(new Posn(n,m+1));
				}
			}else if(k=='q'){
				r_moves();
				b_moves();
			}
			return moves;
		};
		if(key[0]=='*'){
			return op_moves(key);
		}else{
			return you_moves(key);
		}
	},
	get_state: function(){

		let state=this.piece_count;
		// let center_control=0;
		// for(let f=4;f<=5;f++){
		// 	for(let a=3;a<=6;a++){
		// 		const b=this.field[f][a];
		// 		if(b!=null){
		// 			if(b[0]=='*'){
		// 				center_control-=1;
		// 			}else{
		// 				center_control+=1;
		// 			}
		// 		}
		// 	}
		// }
		// state+=center_control;
		for(let f=1;f<=8;f++){
			for(let a=1;a<=8;a++){
				const b=this.field[f][a];
				if(b){
					const k=(b[0]=='*')?b[1]:b[0];
					const m=(b[0]=='*')?-1:1;
					if(k=='p'){
						state+=m*pawn_table[-1*f+8][a-1]/100;
					}else if(k=='n'){
						state+=m*knight_table[f-1][a-1]/100;
					}else if(k=='b'){
						state+=m*bishop_table[f-1][a-1]/100;
					}
				}
			}
		}
		if(this.is_max){
			if(this.is_check('')){
				state-=0.75;
				if(this.is_checkmate('')){
					state-=1000;
				}
			}
		}else{
			if(this.is_check('*')){
				state+=0.75;
				if(this.is_checkmate('*')){
					state+=1000;
				}
			}			
		}
		if(this.you_castled){
			state+=0.5;
		}
		if(this.op_castled){
			state-=0.5;
		}

		return state;
	},
	value_of: function(key){
		if(key[0]=='*'){
			key=key.slice(1);
		}
		const k=key[0];
		if(k=='p'){
			return 1;
		}else if(k=='n'){
			return 3;
		}else if(k=='b'){
			return 3.5;
		}else if(k=='r'){
			return 5;
		}else if(k=='q'){
			return 10;
		}else if (k=='k'){
			return 3;
		}
	},
	play:function(arr){
		for(let f=0;f+1<arr.length;f+=2){
			this.move(arr[f],arr[f+1]);
		}
	},
	read:function(arr){
		 const end =(v)=>{
			console.log(v);
			this.move(v[0],v[1]);
		};
		const acc=[];
		for(let f=0;f<arr.length;f++){
			const str = arr[f];
			let move='';
			for(let f=0;f<str.length;f++){
				const a=str[f];
				if(!((a>='a'&&a<='h')||(a>='1'&&a<='8')||a=='B'||a=='R'||a=='K'||a=='Q'||a=='N'||a=='x'||a=='+'||a=='O'||a=='-')){

					if(f+1<=str.length){
						move+='x';
						const b =str[f+1];
						if(!((b>='a'&& b<='h')||(b>='1'&&b<='8')||b=='B'||b=='R'||b=='K'||b=='Q'||b=='N'||b=='x')){
							f++;
						}
					}else{

					}
				}else{
					if(!(a=='+')){
						move+=a;
					}
				}
			}
			const s = move.length;
			const p = move.slice(s-2);
			const n = p[0].charCodeAt(0)-97+1;
			const m = parseInt(p[1]);
			const posn = new Posn(n,m);
			const player = (f%2==0)?(''):('*');
			if(s==2){
				//pawn move, c5
				const key = this.search(player + 'p', n, m);
				end([key,posn]);
			}else if(move=='O-O'){
				//castle
				end([player+'k',new Posn(0,0)]);
			}else if(s==3){
				//Piece move, Be5
				const k = move[0].toLowerCase();
				const key = this.search(player + k, n, m);
				end([key,posn]);
			}else if(s==4){
				//pawn eat, ?piece move, exd5, Ngf3, N5f3, Bxe5
				if(move[1]=='x'){
					// exd5,Bxe5
					if(move[0]<'a'){
						//Bxe5
						const k=move[0].toLowerCase();
						const key = this.search(player + k, n, m);
						end([key,posn]);
					}else{
						//exd5
						const c = move[0].charCodeAt(0)-97+1;
						const key = this.search_n(player + 'p', n, m, c);
						end([key,posn]);
					}
				}else{
					//Ngf3, N5f3
					const k = move[0].toLowerCase();
					if(isNaN(move[1])){
						//Ngf3
						const c = move[1].charCodeAt(0)-97+1;
						const key=this.search_n(player+k,n,m,c);
						end([key,posn]);
					}else{
						//N5f3
						const r = parseInt(move[1]);
						const key = this.search_m(player+k,n,m,r);
						end([key,posn]);
					}

				}
			}else if(move=='O-O-O'){
				//castle
				end([player+'k',new Posn(-1,0)]);
			}else if(s==5){
				//?piece eat N5xf3, Ngxf3
				const k = move[0].toLowerCase();
				if(isNaN(move[1])){
					//Ngxf3
					const c = move[1].charCodeAt(0)-97+1;
					const key = this.search_n(player+k,n,m,c);
					end([key,posn]);
				}else{
					//N5xf3
					const r = move[1].charCodeAt(0)-97+1;
					const key = this.search_m(player+k,n,m,r);
					end([key,posn]);
				}
			}
		}
	},
	search_:function(k,n,m,c,r){
		if(k=='k'||k=='q'||k=='*k'||k=='*q'){
			return k;
		}else if(k=='p'||k=='*p'){
			for(let f=1;f<=8;f++){
				const pos= (k[0]=='*')?(this.op.get(k+f)):(this.you.get(k+f));
				if(pos==null||(c!=null&&pos.n!=c)||(r!=null&&pos.m!=r)){
					continue;
				}
				const a=this.all_moves(k+f);
				if(a.filter(
					(i)=>{
						return(i.m==m&&
							i.n==n);
					}).length>0){
					return k+f;
			}
		}
		console.log('error cannot find '+k+" "+n+" "+m);
		return k+1;
	}else{
		const pos = (k[0]=='*')?(this.op.get(k+1)):(this.you.get(k+1));
		if(pos==null||(c!=null&&pos.n!=c)||(r!=null&&pos.m!=r)){
			return k+2;
		}
		const a=this.all_moves(k+'1');
		if(a.filter(
			(i)=>{
				return(i.m==m&&
					i.n==n);
			}).length>0){
			return k+'1';
	}else{
		return k+'2';
	}
}
},
search_n:function(k,n,m,c){
	return this.search_(k,n,m,c,null);
},
search_m:function(k,n,m,r){
	return this.search_(k,n,m,null,r);
},
search:function(k,n,m){
	return this.search_(k,n,m,null,null);
},
set_piece:function(key,p){
	if(key[0]=='*'){
		this.op.set(key,p);
	}else{
		this.you.set(key,p);
	}
	this.field[p.m][p.m]=key;
},
// t = '*' or ''
is_check:function(t,p){
	//console.log((t=='*')?(this.op):(this.you));
	const player=t;
	const op=(t=='*')?'':'*';
	const get_posn = (key)=>{
		const posn=(t=='*')?(this.op.get(key)):(this.you.get(key));
		return posn;
	};
	const posn = (p==null)?get_posn(player+'k'):p;
	if(!posn){
		console.log(t);
		console.log(this);
	}
	const rook = 'r';
	const bishop =  'b';
	const knight =  'n';
	const queen =  'q';
	const pawn =  'p';
	//check rook, bishop, knight
	const check_piece = (k)=>{
		const moves=this.imagine_moves(player+k+1, posn);
		for(let f=0;f<moves.length;f++){
			const p = moves[f];
			const a = this.field[p.m][p.n];
			if(a==op+k+1||a==op+k+2){
				return true;
			}
		}
		return false;
	};
	//check queen
	const check_queen = ()=>{
		const moves=this.imagine_moves(player+queen, posn);
		for(let f=0;f<moves.length;f++){
			const p = moves[f];
			const a = this.field[p.m][p.n];
			if(a==op+'q'){
				return true;
			}
		}
		return false;
	};

	//check pawn
	const check_pawn = ()=>{
			const n=posn.n;
			const m=posn.m;
		if(player=='*'){
			const pp1 = (m-1>=1&&n-1>=1)?this.field[m-1][n-1]:null;
			const pp2 = (m-1>=1&&n+1<=8)?this.field[m-1][n+1]:null;
			if((pp1!=null&&pp1[0]=='p')||(pp2!=null&&pp2[0]=='p')){
				return true;
			}
		}else{
			const pp1 = (m+1<=8&&n-1>=1)?this.field[m+1][n-1]:null;
			const pp2 = (m+1<=8&&n+1<=8)?this.field[m+1][n+1]:null;
			if((pp1!=null&&pp1[0]=='*'&&pp1[1]=='p')||(pp2!=null&&pp2[0]=='*'&&pp2[1]=='p')){
				return true;
			}
		}
		return false;
	};

	return check_piece(rook)||check_piece(bishop)||check_piece(knight)||check_queen()||check_pawn();
},
is_checkmate:function(t){

	if(!this.is_check(t,null)){
		return false;
	}
	const moves=this.all_moves(t+'k');
	for(let f=0;f<moves.length;f++){
		const p=moves[f];
		if(!this.is_check(t,p)){
			return false;
		}
	}
	const pieces=(t=='*')?(this.op):(this.you);
	for(let [key,value] of pieces){

		const moves=this.all_moves(key);
		if(moves.length>0){
			return false;
		}
	}
	return true;
	}
}




