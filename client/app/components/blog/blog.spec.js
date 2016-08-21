import {blog} from './blog'
import {BlogController} from './blog.controller';
import {blogDirective} from './blog.directive';
import template from './blog.html';

describe('Blog', ()=>{
  let $rootScope,
  $compile,
  makeController;

  beforeEach(window.module(blog.name));
  beforeEach(inject((_$rootScope_,_$compile_)=>{
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    makeController = ()=>{
      return new BlogController();
    };
  }));

  describe('Module', ()=>{
    // test things about the component module
    // checking to see if it registers certain things and what not
    // test for best practices with naming too
    // test for routing
    it('should have an appropriate name', () =>{
      expect(blog.name).to.equal('blog');
    });
  });

  describe('Controller', ()=>{
    // test your controller here

    it('should have a lastName property', ()=>{ // erase me if you remove this.name from the controller
      let controller = makeController();

      expect(controller).to.have.property('lastName');
    });
    it('should have a firstName property', ()=>{ // erase me if you remove this.name from the controller
      let controller = makeController();

      expect(controller).to.have.property('firstName');
    });
  });

  describe('Template', ()=>{
    // test the template
    // use Regexes to test that you are using the right bindings {{  }}

    it('should have firstName in template', ()=>{
      expect(template).to.match(/{{\s?vm\.firstName\s?}}/g);
    });
  });


  describe('Directive', ()=>{
      // test the component/directive itself
      let directive = blogDirective();

      it('should use the right template',()=>{
        expect(directive.template).to.equal(template);
      });

      it('should use controllerAs', ()=>{
        expect(directive).to.have.property('controllerAs');
      });

      it('should use the right controller', ()=>{
        expect(directive.controller).to.equal(BlogController);
      });
      
      it('Should match the template',()=>{
          let element = $compile('<blog/>')($rootScope);
          $rootScope.$digest();
          expect(element.html()).to.contain('Hello Willy');
      });
      

  });
});
