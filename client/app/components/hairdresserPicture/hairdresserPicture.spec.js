import {hairdresserPicture} from './hairdresserPicture'
import {HairdresserPictureController} from './hairdresserPicture.controller';
import {hairdresserPictureDirective} from './hairdresserPicture.directive';
import template from './hairdresserPicture.html';

describe('HairdresserPicture', ()=>{
  let $rootScope,
  makeController;

  beforeEach(window.module(hairdresserPicture.name));
  beforeEach(inject((_$rootScope_)=>{
    $rootScope = _$rootScope_;
    makeController = ()=>{
      return new HairdresserPictureController();
    };
  }));

  describe('Module', ()=>{
    // test things about the component module
    // checking to see if it registers certain things and what not
    // test for best practices with naming too
    // test for routing
  });

  describe('Controller', ()=>{
    // test your controller here

    it('should have a name property [REMOVE]', ()=>{ // erase me if you remove this.name from the controller
      let controller = makeController();

      expect(controller).to.have.property('greeting');
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
      let directive = hairdresserPictureDirective();

      it('should use the right template',()=>{
        expect(directive.template).to.equal(template);
      });

      it('should use controllerAs', ()=>{
        expect(directive).to.have.property('controllerAs');
      });

      it('should use the right controller', ()=>{
        expect(directive.controller).to.equal(HairdresserPictureController);
      });
  });
});
