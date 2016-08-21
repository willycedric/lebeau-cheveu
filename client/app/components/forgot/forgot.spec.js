import {forgot} from './forgot'
import {ForgotController} from './forgot.controller';
import {forgotDirective} from './forgot.directive';
import template from './forgot.html';

describe('Forgot', ()=>{
  let $rootScope,
  makeController;

  beforeEach(window.module(forgot.name));
  beforeEach(inject((_$rootScope_)=>{
    $rootScope = _$rootScope_;
    makeController = ()=>{
      return new ForgotController();
    };
  }));

  describe('Module', ()=>{
    // test things about the component module
    // checking to see if it registers certain things and what not
    // test for best practices with naming too
    // test for routing
    it('Should have an appropriate name', ()=>{
      expect(forgot.name).to.equal('forgot');
    });
  });

  describe('Controller', ()=>{


    it('should have a name property isUser', ()=>{ 
      let controller = makeController();
      expect(controller).to.have.property('isUser');
    });

    it('should have a name property isError', ()=>{ 
      let controller = makeController();
      expect(controller).to.have.property('isError');
    });

    it('should have a name property errorMessage', ()=>{ 
      let controller = makeController();
      expect(controller).to.have.property('errorMessage');
    });

    it('should have a name property user', ()=>{ 
      let controller = makeController();
      expect(controller).to.have.property('user');
    });

    it('should have a name property updatePassword', ()=>{ 
      let controller = makeController();
      expect(controller).to.have.property('updatePassword');
    });

    it('should have a name property passwordReset', ()=>{ 
      let controller = makeController();
      expect(controller).to.have.property('passwordReset');
    });

    it('should have a name property resetPassword', ()=>{ 
      let controller = makeController();
      expect(controller).to.have.property('resetPassword');
    });
  });

  describe('Template', ()=>{
    // test the template
    // use Regexes to test that you are using the right bindings {{  }}

    it('should have name in template [REMOVE]', ()=>{
      expect(template).to.match(/{{\s?vm\.greeting\s?}}/g);
    });
  });


  describe('Directive', ()=>{
      // test the component/directive itself
      let directive = forgotDirective();

      it('should use the right template',()=>{
        expect(directive.template).to.equal(template);
      });

      it('should use controllerAs', ()=>{
        expect(directive).to.have.property('controllerAs');
      });

      it('should use the right controller', ()=>{
        expect(directive.controller).to.equal(ForgotController);
      });
  });
});
