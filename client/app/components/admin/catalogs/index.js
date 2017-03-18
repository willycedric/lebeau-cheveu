import {adminCatalogsIndexModule} from './admin-catalogs';
import {adminCatalogDetailModule} from './admin-catalog';
export const adminCatalogsModule = angular.module('adminCatalogsModule', [
  adminCatalogsIndexModule.name,
  adminCatalogDetailModule.name
]);