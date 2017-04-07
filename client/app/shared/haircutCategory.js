const HaircutCategoryFactory = () =>{
	var listOfCategory =[];
	var currentCategoryIndex;

	const addCategory = (category)=>{
		listOfCategory.push(category);
	};

	const getCategories = () =>{
		return listOfCategory;
	}
	const setIndex = (index)=> {
		currentCategoryIndex=index;
	};

	const getCurrentIndex = ()=>{
		return currentCategoryIndex;
	}

	return{
		addCategory,
		getCategories,
		setIndex,
		getCurrentIndex
	}
};

export {HaircutCategoryFactory};