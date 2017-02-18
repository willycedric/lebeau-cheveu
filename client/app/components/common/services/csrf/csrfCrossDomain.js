// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
import {csrfServiceModuleTata} from './service/csrfService';

console.log()
/*angular.module('csrfCrossDomainConfigModule', [])
    .value('csrfCrossDomainConfig', {
        debug: true
    });*/
export const csrfCrossDomainModule = angular.module('csrfCrossDomainModule',
    [
         csrfServiceModuleTata.name
]);