import {adminModule} from './admin';
import {adminUsersModule} from './users/index';
import {adminAccountsModule} from './accounts/index';
import {adminHairdressersModule} from './hairdressers/index';
import {adminAdministratorsModule} from './administrators/index';
import {adminAdminGroupsModule} from './admin-groups/index';
import {adminStatusesModule} from './statuses/index';
import {adminCategoriesModule} from './categories/index';
import {adminBlogCategoriesModule} from './blog-categories/index';
import {adminBlogModule} from './blogs/index';
import {adminCatalogsModule} from './catalogs/index';
import {adminGalleyModule} from './gallery-entries/index';
import {adminHaircutCategoryModule} from './haircut-category/index';
export const  admin = angular.module('admin', [
  adminModule.name,
  adminUsersModule.name,
  adminAccountsModule.name,
  adminAdministratorsModule.name,
  adminAdminGroupsModule.name,
  adminStatusesModule.name,
  adminCategoriesModule.name,
  adminBlogCategoriesModule.name,
  adminHairdressersModule.name,
  adminBlogModule.name,
  adminCatalogsModule.name,
  adminGalleyModule.name,
  adminHaircutCategoryModule.name
]);