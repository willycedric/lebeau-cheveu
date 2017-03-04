import {adminBlogsDetailModule} from './admin-blog';
import {adminBlogsIndexModule} from './admin-blogs';
export const adminBlogModule = angular.module('adminBlogModule', [
  adminBlogsDetailModule.name,
  adminBlogsIndexModule.name
]);