import {home} from './home'
import {HomeController} from './home.controller';
import {homeDirective} from './home.directive';
import template from './home.html';

describe('Home', ()=>{
  let $rootScope,
  makeController;

  beforeEach(window.module(home.name));
  beforeEach(inject((_$rootScope_)=>{
    $rootScope = _$rootScope_;
    makeController = ()=>{
      return new HomeController();
    };
  }));
  describe('Module', ()=>{
    // test things about the component module
    // checking to see if it registers certain things and what not
    // test for best practices with naming too
    // test for routing
    it('Should have an appropriate name', ()=>{
      expect(home.name).to.equal('home');
    });
  });

  describe('Controller', ()=>{
    // test your controller here

    //Testing controller caroussel logic
    it('should have a name property nbImages', ()=>{ 
      let controller = makeController();

      expect(controller).to.have.property('nbImages');
    });
    it('should have a name property myInterval', ()=>{ 
      let controller = makeController();
      expect(controller).to.have.property('myInterval');
    });
    it('should have a name property labels', ()=>{ 
      let controller = makeController();
      expect(controller).to.have.property('labels');
    });
    it('should have a name property noWrapSlides', ()=>{ 
      let controller = makeController();

      expect(controller).to.have.property('noWrapSlides');
    });
    it('should have a name property slides', ()=>{ 
      let controller = makeController();

      expect(controller).to.have.property('slides');
    });

    //Testing controller Map logic
    it('should have a name property mapstroke', ()=>{ 
      let controller = makeController();

      expect(controller).to.have.property('mapstroke');
    });
    it('should have a name property mapstroke_width', ()=>{ 
      let controller = makeController();

      expect(controller).to.have.property('mapstroke_width');
    });
    it('should have a name property mapWidth', ()=>{ 
      let controller = makeController();

      expect(controller).to.have.property('mapWidth');
    });
    it('should have a name property mapHeight', ()=>{ 
      let controller = makeController();

      expect(controller).to.have.property('mapHeight');
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
      let directive = homeDirective();

      it('should use the right template',()=>{
        expect(directive.template).to.equal(template);
      });

      it('should use controllerAs', ()=>{
        expect(directive).to.have.property('controllerAs');
      });

      it('should use the right controller', ()=>{
        expect(directive.controller).to.equal(homeController);
      });
  });
});
