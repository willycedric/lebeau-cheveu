import {adminBlogCategoriesIndexModule} from './admin-blog-categories';
import {adminBlogCategoriesDetailModule} from './admin-blog-category';
export const adminBlogCategoriesModule = angular.module('adminBlogCategoriesModule', [
  adminBlogCategoriesIndexModule.name,
  adminBlogCategoriesDetailModule.name
]);