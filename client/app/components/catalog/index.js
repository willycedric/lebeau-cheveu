import {catalogIndexModule} from './catalogs';
import{viewCatalogDetailsModule} from './catalog-details';
export const catalogModule = angular.module('catalogModule', [
  catalogIndexModule.name,
  viewCatalogDetailsModule.name
]);