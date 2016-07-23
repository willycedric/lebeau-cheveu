const userFactory = () =>{
	let loggedUser ={};
	let logged = false;

	const pushUser = (user) =>{
		loggedUser=user;
	};

	const getUser =() =>{
		return loggedUser;
	};

	const getLogged= ()=>{
		return logged;
	};

	const setLogged =(flag)=>{
		logged=flag;
	};

	return {pushUser,getUser,getLogged,setLogged};
};
export {userFactory};