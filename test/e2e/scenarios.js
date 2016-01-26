'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('blog App', function() {

  it('should redirect index.html to index.html#/phones', function() {
		browser.get('');
		browser.getLocationAbsUrl().then(function(url) {
			expect(url).toEqual('/login');
		  });
  });

  it('filter the one', function (done) {
	  browser.get('');
	  var account = element(by.model('account'));
	  var password = element(by.model('password'));
	  account.sendKeys('14331048');
	  password.sendKeys('14331048');
	  var submit = element(by.css('#submit'));
	  submit.click();
	  browser.getLocationAbsUrl().then(function(url) {
			expect(url).toEqual('/user');
	  });
	  var userPostList = element.all(by.repeater('postData in userData.posts'));
	  var search = element(by.model('search'));
	  search.sendKeys('gulp');
	  expect(userPostList.count()).toBe(1);
	  search.clear();
	  search.sendKeys('gul');
	  expect(userPostList.count()).toBe(2);
	  submit.click(); // this has been the write blog click
	  expect(element(by.binding('message')).getText()).toContain('blog标题为空');
	  done();
  });
	  it('blog home', function (done) {
	  	var link = element(by.css('a[href="#home/page/1"]'));
	  	link.click();
	  	browser.getLocationAbsUrl().then(function(url) {
				expect(url).toEqual('/home/page/1');
		  });
		  var homePostList = element.all(by.repeater('postData in postsData'));
		  expect(homePostList.count()).toBe(10);
		  var pageIndexs = element.all(by.repeater('i in pagesArray'));
		  pageIndexs.last().click();
		  browser.getLocationAbsUrl().then(function(url) {
				expect(url).toEqual('/home/page/10');
		  });
	  	done();
	  });
});

  // describe('Phone list view', function() {

  //   beforeEach(function() {
  //     browser.get('app/index.html#/phones');
  //   });


  //   it('should filter the phone list as a user types into the search box', function() {

  //     var phoneList = element.all(by.repeater('phone in phones'));
  //     var query = element(by.model('query'));

  //     expect(phoneList.count()).toBe(20);

  //     query.sendKeys('nexus');
  //     expect(phoneList.count()).toBe(1);

  //     query.clear();
  //     query.sendKeys('motorola');
  //     expect(phoneList.count()).toBe(8);
  //   });


  //   it('should be possible to control phone order via the drop down select box', function() {

  //     var phoneNameColumn = element.all(by.repeater('phone in phones').column('phone.name'));
  //     var query = element(by.model('query'));

  //     function getNames() {
  //       return phoneNameColumn.map(function(elm) {
  //         return elm.getText();
  //       });
  //     }

  //     query.sendKeys('tablet'); //let's narrow the dataset to make the test assertions shorter

  //     expect(getNames()).toEqual([
  //       "Motorola XOOM\u2122 with Wi-Fi",
  //       "MOTOROLA XOOM\u2122"
  //     ]);

  //     element(by.model('orderProp')).element(by.css('option[value="name"]')).click();

  //     expect(getNames()).toEqual([
  //       "MOTOROLA XOOM\u2122",
  //       "Motorola XOOM\u2122 with Wi-Fi"
  //     ]);
  //   });


  //   it('should render phone specific links', function() {
  //     var query = element(by.model('query'));
  //     query.sendKeys('nexus');
  //     element.all(by.css('.phones li a')).first().click();
  //     browser.getLocationAbsUrl().then(function(url) {
  //       expect(url).toEqual('/phones/nexus-s');
  //     });
  //   });
  // });


  // describe('Phone detail view', function() {

  //   beforeEach(function() {
  //     browser.get('app/index.html#/phones/nexus-s');
  //   });


  //   it('should display nexus-s page', function() {
  //     expect(element(by.binding('phone.name')).getText()).toBe('Nexus S');
  //   });


  //   it('should display the first phone image as the main phone image', function() {
  //     expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
  //   });


  //   it('should swap main image if a thumbnail image is clicked on', function() {
  //     element(by.css('.phone-thumbs li:nth-child(3) img')).click();
  //     expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);

  //     element(by.css('.phone-thumbs li:nth-child(1) img')).click();
  //     expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
  //   });
  // });
// });