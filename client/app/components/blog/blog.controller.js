class BlogController {
  constructor($http) {
  	 //console.log(this.createPost(this.post));
  	 this.$http=$http;
  	 this.init();
  }

  /**
   * [createPost description]
   * @param  {[type]} post [description]
   * @return {[type]}      [description]
   */
  createPost(post){
  	this.$http.post("http://localhost:3000/api/posts/",post)
  	.success((resp)=>{
  		this.getAllPosts();
  	});
  }

  /**
   * [getAllPosts description]
   * @return {[type]} [description]
   */
  getAllPosts(){
  	this.$http.get("http://localhost:3000/api/posts/")
  	.success(this.getAllPosts());
  }

  init(){
  	this.getAllPosts();
  }

}
BlogController.$inject =['$http'];

export {BlogController};


