import {blogIndexModule} from './blogs';
import {viewBlogDetailsModule} from './blog-details';
export const blogModule = angular.module('blogModule', [
  blogIndexModule.name,
  viewBlogDetailsModule.name 
]);