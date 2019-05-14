(function CACustomScripts() {
	/**
		Polyfill for ChildNode.remove() for IE 11+
		
		From https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill
		Who got it from https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
		
		**/
	(function (arr) {
		arr.forEach(function (item) {
			if (item.hasOwnProperty('remove')) { 
				return; 
			}
			Object.defineProperty(item, 'remove', {
				configurable: true,
				enumerable: true,
				writable: true,
				value: function remove() {
					this.parentNode.removeChild(this);
				}
			});
		});
	})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
	
	/* Utility function to get an animation frame */
	let ticking = false;
	
	/* 
		Tests is a selector is a String or DOM Node, retunrs the selected Node if it can
		Throws an Error otherwise
		*/
	function _getDOMNode(selector) {
		let $el = null;
		if (typeof selector === 'string') {
			if (document.querySelector(selector) === null) {
				return null;
			}
			$el = document.querySelector(selector);
			return $el ;
		} else if (selector instanceof Node) {
			$el = selector;
			return $el;
		} else {
			throw new Error(`Element selector must be a String value or a Document Node object`);
		}
	}
	/* 
		Tests will a string selector will return a DOM Node, retunrs an array of Nodes if it can
		Throws an Error otherwise
		*/
	function _getAllDOMNodes(selector) {
		let $els = null;
		if (typeof selector === 'string') {
			if (document.querySelectorAll(selector) === null) {
				return null;
			}
			$els = document.querySelectorAll(selector);
			return $els ;
		} else {
			throw new Error(`Element selector must be a String value`);
		}
	}
	function getTick() {
		if (!ticking) {
			requestAnimationFrame(() => {
				addClass('.page-bottom-links-top', 'is-visible');
			});
			ticking = true;
		}
	}
	/**
		Adds a class to a Node list with a timeout between each  
		selector: 			DOM Node selector
		timeout: 				delay between each iteration
		*/
	function addClassTimed(els, className, timeout) {
		let $els = [];
		if (Array.isArray(els)) {
			$els = els;
		} else if (els instanceof Node) {
			$els[0] = _getDOMNode(els);	
		} else if (_getAllDOMNodes(els).length > 0) {
			$els = _getAllDOMNodes(els);	
		} else {
			throw new Error('addClassTimed selector must return a DOM node');
		}
		
		function _addClass() {
			setTimeout(() => {
				if (count < $els.length) {
					$els[count].classList.add(className); 
					count++;
					_addClass($els[count], className); 
				} else {
					return;
				}
			}, timeout);
		}
		let count = 0;
		_addClass();
	}//addClassTimed()
	/** 
		el: 				DOM HTML Element
		classList: 	One or more classes to add
		*/
	function addClass(el, classList) {
		let $el = null;
		if (arguments.length < 2) {
			throw new Error(`BC function addClass: Requiers a String or DOM Node element then a list of class names`);
		}
		if (_getDOMNode(el) !== null) {
			$el = _getDOMNode(el);	
		} else {
			throw new Error('addClass selector must be a DOM node');
		}
		function _addClass(cls) {
			if (document.querySelector('html').contains($el)) {
				if (!ticking) {
					requestAnimationFrame(() => {
						$el.classList.add(cls);

					});
					ticking = true;	
				}
				ticking = false;	
			} else {
				$el.classList.add(cls);
			}
		}
		for (let arg = 1; arg < arguments.length; arg++) {
			_addClass(arguments[arg]);
		}
	}//addClass()
	/** 
		Check if an element has a class
		el:				DOM HTML Element
		className:One or more classes to add
		returns: 	true/false or error if the el is not a DOM node or a valid query selector
		*/
	function hasClass(el, className) {
		let $el = null;
		if (arguments.length < 2) {
			throw new Error(`BC function addClass: Requiers a String or DOM Node element then a list of class names`);
		}
		if (_getDOMNode(el) !== null) {
			$el = _getDOMNode(el);	
		} else {
			throw new Error('addClass selector must be a DOM node');
		}
		return $el.classList.contains(className);
	}//addClass()
	function removeClass(el, classList) {
		let $el = null;
		if (arguments.length < 2) {
			throw new Error(`Requires a String or DOM Node element then a list of class names`);
		}
		$el = _getDOMNode(el);
		function _removeClass(cls) {
			if (document.querySelector('html').contains($el)) {
				if (!ticking) {
					requestAnimationFrame(() => {
						$el.classList.remove(cls);
					});
					ticking = true;
				}
				ticking = false;	
			} else {
				$el.classList.remove(cls);
			}
		}
		for (let arg = 1; arg < arguments.length; arg++) {
				_removeClass(arguments[arg]);
		}
	}//addClass()
	function emptyElement(el) {
		if (_getDOMNode(el)) {
			const $el = _getDOMNode(el);
			while ($el.firstChild) {
				el.removeChild($el.firstChild);
			}
		}
	}
	//AJAX functions
	function bcAJAX(url, options) {
		if (options !== undefined) {
			return fetch(url, options);	
		} else {
			return fetch(url);
		}
		
	}
	function getJSON(url, opts) {
		this.options = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		if (opts) {
			this.options = Object.assign(this.options, opts);
		}
		return bcAJAX(url, this.options).then((data) => {
			return Promise.resolve(data);
		}).catch((err) => {
			return Promise.reject(err);
		});
	}
	
	/* Window scrolling */
	let lastScrollY 		= window.scrollY;
	let thisScrollY 		= 0;
	let scrollDirection = 0; 
	function detectScrollPosition($el = window) {
		return $el.scrollY;
	}//detectScrollPosition()
	function detectScrollDirection($el = window) {
		//let lastScrollY = $el.scrollY;
		let scrollDirection = -1; //down, up = 1
		scrollDirection = (lastScrollY < $el.scrollY) ? -1 : 1;
		lastScrollY = $el.scrollY;
		return scrollDirection;
		
	}//detectScrollDirection()
	
	//Inner navigation show/hide
	function bcInnerNav(navContainer) {
		/* 
			Does inner navigation show/hide 
			Works on the icon in inner nav elements which have dropdowns
			The argument is the navigaiton container
		*/
		const innerNavIcons = navContainer.querySelectorAll('.bc-inner-nav-icon');
		innerNavIcons.forEach((el, idx) => {
			function innerNavToggle(target, event, cb) {
				const thisDropdown = target.parentElement.querySelector('.bc-inner-nav-dropdown');
				const thisDropdownScrollHeight = thisDropdown.scrollHeight;
				if (thisDropdown.classList.contains('active')) {
					requestAnimationFrame(() => {
						thisDropdown.style.height = thisDropdownScrollHeight + 'px';
						requestAnimationFrame(() => {
							thisDropdown.style.height = 0;		
						});
					});
					thisDropdown.addEventListener('transitionend', function(e) {
						thisDropdown.removeEventListener('transitionend', arguments.callee) ;
						cb(thisDropdown);
					});

				} else {
					thisDropdown.addEventListener('transitionend', function(e) {
						thisDropdown.removeEventListener('transitionend', arguments.callee) ;
						thisDropdown.style.height = 'auto';
					});
					thisDropdown.style.height = thisDropdownScrollHeight + 'px';	
					cb(thisDropdown);
				}
			}
			el.addEventListener('click', (e) => {
				e.preventDefault();
				innerNavToggle(el, e, (dropdown) => {
					dropdown.classList.toggle('active');
				});
			});	
		}); 
	}//bcInnerNav()
	/** 
		container: 	DOM object
		image: 			media element - img, video
		*/
	function mediaFiller(container, image) {
		if (container.scrollWidth > image.scrollWidth) {
			image.style.width = container.scrollWidth+"px";
			image.style.height = 'auto';
		} else if (container.scrollHeight > image.scrollHeight) {
			image.style.height = container.scrollHeight+"px";
			image.style.width = 'auto';
		}
	}

	/** 
		toggler:  		DOM element: toggle trigger
		target: 			DOM element: toggle target
		activeClass: 	String: active class to add/remove
		callback: 		Callback function, gets the toggled element and the toggler
		*/
	function toggleVisibility(toggler, target, eventType, activeClass, callback) {
		if (toggler !== undefined && target !== undefined && eventType !== undefined) {
			toggler.addEventListener(eventType, () => {
				//
			});
		}
	} 
	/** 
		el:  					DOM element: class toggle target 
		className: 		String: active class to toggle
		callback: 		Callback function, get the el and the className on success
		*/
	function classToggle(el, classname, callback) {
		if ((el !== undefined && el instanceof Node) && (classname !== undefined && typeof classname === 'string')) {
			
			el.classList.toggle(classname);
			if (typeof callback == 'function') {
				callback(el, classname);
			}
		} else {
			throw new Error('Function classToggle requires: a HTML Node and a class name of type String');
		}
	} 

	/* CA custom Scripts */
	//Hero image on landing page - ensure it covers it's container
	if (window.outerWidth >= 900 && document.querySelectorAll('.bc-landing-hero')[0] !== undefined) {
		mediaFiller(document.querySelectorAll('.bc-landing-hero .bc-hero-image')[0], document.querySelectorAll('.bc-landing-hero .bc-hero-image img')[0]);
	}
	window.onresize = () => {
		if (window.outerWidth > 900 && document.querySelectorAll('.bc-landing-hero')[0] !== undefined) {
			mediaFiller(document.querySelectorAll('.bc-landing-hero .bc-hero-image')[0], document.querySelectorAll('.bc-landing-hero .bc-hero-image img')[0]);
		}
	};

	//Header menu showhide for mobile viewports
	const headerMenuToggle = document.querySelectorAll('.bc-header-menu__toggle')[0]; 
	headerMenuToggle.addEventListener('click', (e) => {
		classToggle(document.querySelectorAll('.bc-header-menu--show-hide')[0], 'menu-active');
	});

	//Flickity.js
	if (document.querySelector('.ca-project-slider')) {
		const elem = document.querySelector('.ca-project-slider');
		const flkty = new Flickity( elem, {
			// options

		});
	}
	if (document.querySelector('.bc-slider-slides')) {
		const elem = document.querySelector('.bc-slider-slides');
		const flkty = new Flickity( elem, {
			pageDots: false,
			prevNextButtons: false
		});
		const slidesLength = flkty.slides.length;
		const slidesCount = document.querySelector('.bc-slider-controls .bc-slider-controls__counter .bc-slider-counter-count');
		slidesCount.innerHTML = slidesLength;
		let currentSlide = 1;
		const slidesCurrent = document.querySelector('.bc-slider-controls .bc-slider-controls__counter .bc-slider-counter-current');
		slidesCurrent.innerHTML = currentSlide;
		const sliderNext = document.querySelector('.bc-slider-controls__next');
		const sliderPrev = document.querySelector('.bc-slider-controls__prev');
		flkty.on('change', (idx) => {
			slidesCurrent.innerHTML = idx + 1; 
		});
		sliderNext.addEventListener('click', (e) => {
			flkty.next();

		});
		sliderPrev.addEventListener('click', (e) => {
			flkty.previous();
		});
	}
	/** 
		Global scroll events 
		*/
	const $topLink = document.querySelector('.page-bottom-links-top');
	window.addEventListener('scroll', (e) => {
		/* Page top links - float if scroll is > viewport height + 40px */
		function _isFooterVisible() {	
			return (detectScrollPosition() + window.innerHeight) >= document.querySelector('footer').offsetTop;
		}
		if (document.querySelector('.page-bottom-links-top')) {
			
			if (_isFooterVisible()) {
				if ($topLink.classList.contains('is-fixed')) {	
					//addClass('.page-bottom-links-top', 'is-hidden');	
					addClass($topLink, 'is-hidden');
					removeClass($topLink, 'is-fixed');
					setTimeout(() => {
							removeClass($topLink, 'is-hidden');
					}, 200);

				}
				return true;
			}
			if (detectScrollPosition() > window.innerHeight / 3) {
				if ($topLink.classList.contains('is-fixed') === false) {				
					addClass($topLink, 'is-hidden');
					addClass($topLink, 'is-fixed');
					setTimeout(() => {
						removeClass($topLink, 'is-hidden');
					}, 220);
					
				}
			} else if ($topLink.classList.contains('is-fixed')) {
				addClass($topLink, 'is-hidden');
				removeClass($topLink, 'is-fixed');
				setTimeout(() => {
						removeClass($topLink, 'is-hidden');
				}, 220);
			}
		}
	});//On page scroll
	
	/**
		Scroll to top 
		*/
	if ($topLink) {
		$topLink.addEventListener('click', (evt) => {
			window.scroll(0, 0);
		});	
	}
	
	/** 
		CA Projects: Load projects
		Project filters
		*/
	
	function writeCAProjects(projects, projectsFilter) {
		/* Make a single card */
		function _makeCard(project) {
			//The card
			const projectCard = document.createElement('article');
			addClass(projectCard, 'bc-card', 'bc-card--slide-up', 'bc-fade-in-up'); 
			for (let category of project.categories.split(', '))	 {
				projectCard.setAttribute('data-project-categories', category); 
			}
			
			//The image
			const cardImg = document.createElement('img');
			cardImg.setAttribute('src', project.image);
			cardImg.setAttribute('alt', project.title);
			
			const cardFigure = document.createElement('figure');
			addClass(cardFigure, 'bc-card-img', 'is-square');
			cardFigure.append(cardImg); 
			
			//Card content
			const cardContent = document.createElement('div');
			addClass(cardContent, 'bc-card-content');
			
			const cardLinkWrap = document.createElement('a');
			cardLinkWrap.setAttribute('href', project.projlink);
			
			//Card info
			const cardInfo = document.createElement('div');
			addClass(cardInfo, 'bc-card-info');
			const title = document.createElement('h2');
			title.append(project.title);
			addClass(title, 'bc-card-title');
			const subTitle = document.createElement('p');
			subTitle.append(project.location);
			addClass(subTitle, 'bc-card-subtitle');
			cardInfo.append(title);
			cardInfo.append(subTitle);
			
			//Content separator
			const contentSeparator = document.createElement('div');
			addClass(contentSeparator, 'content-separator');
			
			//Card link
			const cardLink = document.createElement('div');
			addClass(cardLink, 'bc-card-link');
			const cardLinkText = document.createElement('span');
			addClass(cardLinkText, 'bc-card-link-text');
			cardLinkText.append(project.linktext);
			
			//SVG Icon
			const svgIcon = document.createElement('svg');
			addClass(svgIcon, 'svg-icon');
			const use = document.createElement('use');
			use.setAttribute('xlink:href', '/assets/media/svg/bc-icons.svg#arrow');
			svgIcon.append(use);
			
			cardLink.append(cardLinkText, svgIcon);
			
			//Append
			cardLinkWrap.append(cardInfo, contentSeparator, cardLink);
			cardContent.append(cardLinkWrap);
			projectCard.append(cardFigure, cardContent);
			return projectCard;
			
		}//_makeCard()
		
				const $projectsGrid = document.querySelector('.ca-projects-grid');
				
				//Clear all cards in the page
				/*	const projCards = $projectsGrid.querySelectorAll('.bc-card');
					for (const card of projCards) {
						card.remove();
					}*/
		emptyElement($projectsGrid);
					$projectsGrid.style.minHeight = '100vh';
					if (projectsFilter === 'all-projects') {
						let newCards = [];
						let newCard = null;
						for (const project of projects) {
							newCard = _makeCard(project);
							$projectsGrid.append(newCard);
							newCards.push(newCard);
						}
						addClassTimed(newCards, 'bc-fade-in-up--loaded', 180);
					} else if (projectsFilter === 'project-category') {
						let categorizedProjects = [];
						for (const project of projects) {
							/*
								Temporary categorized projects objects array:
								categorizedProjects = [
										{
											category: 'Housing', 
											projects: [
												project1, project2, project3
											]
										},
										{
											category: 'Sport', 
											projects: [
												project1, project2, project3
											]
										},
										{
											...etc...
										}
									]
								*/
							const thisProjectCategories = project.categoriestext.split(', ');
							
							for (const category in thisProjectCategories) {
								const thisCategory = categorizedProjects.find((elm) => {
									return elm.category === thisProjectCategories[category];
								});
								if (thisCategory !== undefined) {
									thisCategory.projects.push(project);
								} else {
									const newCat = {};
									newCat.category = thisProjectCategories[category];
									newCat.projects = [project];
									categorizedProjects.push(newCat);
								}
							}
						}
						/* 
							Write the projects by category
							*/
						for (const cat in categorizedProjects) {
							//<h1 class="ca-projects-filter-title">All projects</h1>
							const $catHeading = document.createElement('h1'); 
							$catHeading.append(categorizedProjects[cat].category);
							addClass($catHeading, 'ca-projects-filter-title', 'bc-fade-in-up');
							$projectsGrid.append($catHeading);
							addClassTimed($catHeading, 'bc-fade-in-up--loaded', 180);
							let newCards = [];
							for (const proj of categorizedProjects[cat].projects) {
								const newCard = _makeCard(proj);
								$projectsGrid.append(newCard);	
								newCards.push(newCard);
							}
							addClassTimed(newCards, 'bc-fade-in-up--loaded', 220);
							
						}
					} else if (projectsFilter === 'project-date') {
						console.log(`Filter by date`);
						let categorizedProjects = [];
						for (const project of projects) {
							/*
								Temporary categorized projects objects array:
								categorizedProjects = [
										{
											category: 'Housing', 
											projects: [
												project1, project2, project3
											]
										},
										{
											category: 'Sport', 
											projects: [
												project1, project2, project3
											]
										},
										{
											...etc...
										}
									]
								*/
							const thisProjectYear = new Date(project.date);
							
							
								const thisCategory = categorizedProjects.find((elm) => {
									
									return elm.category.getUTCFullYear() === thisProjectYear.getUTCFullYear();
								});
								if (thisCategory !== undefined) {
									console.log(thisCategory);
									thisCategory.projects.push(project);
								} else {
									const newCat = {};
										console.log(thisProjectYear);
									newCat.category = thisProjectYear;
									newCat.projects = [project];
									categorizedProjects.push(newCat);
								}
						}
						categorizedProjects.sort((a, b) => {
							return b.category.getUTCFullYear() - a.category.getUTCFullYear();
						});
						for (const cat in categorizedProjects) {
							//<h1 class="ca-projects-filter-title">All projects</h1>
							const $catHeading = document.createElement('h1'); 
							$catHeading.append(categorizedProjects[cat].category.getUTCFullYear());
							addClass($catHeading, 'ca-projects-filter-title', 'bc-fade-in-up');
							$projectsGrid.append($catHeading);
							addClassTimed($catHeading, 'bc-fade-in-up--loaded', 180);
							let newCards = [];
							for (const proj of categorizedProjects[cat].projects) {
								const newCard = _makeCard(proj);
								$projectsGrid.append(newCard);	
								newCards.push(newCard);
							}
							addClassTimed(newCards, 'bc-fade-in-up--loaded', 220);
							
						}
					}//filter by date
		
		
	}//loadCAProject()
	/** 
		Global onload events 
		*/
	window.addEventListener('load', (evt) => {
		/* fade-in-up, up elements, mostly used on cards */
		if (document.querySelector('.bc-fade-in-up') !== null) {
			addClassTimed('.bc-fade-in-up', 'bc-fade-in-up--loaded', 160);	
		}
	});// window.onload
	/*if (document.querySelector('.bc-inner-nav')) {
		bcInnerNav(document.querySelector('.bc-inner-nav')); 
	}*/
	const projectsFilter = 'all-projects';
	//writeProjects(null, projects);
	//the Projects grid
	function filterCAProjects(fltr) {
		return new Promise((resolve, reject) => {
			getJSON('http://localhost:9001/data/projects.json', {cache: 'no-cache'}).then((data) => {
				return data.json();
			}).then((projects) => {
				if (true) {
					//No cookie set
					writeCAProjects(projects, fltr); 
				} else {
					const projectFilter = 'project-category';	 //get cookie value
					writeCAProjects(projects, fltr);
				}
				resolve(true);
			}).catch((err) => {
				reject(err);
			});//getJSON	
		});
	}
	function _getProjectFilter(evt) { 
		return evt.target.getAttribute('data-filter');
	} 
	
	if (_getDOMNode('.ca-projects-grid') && _getDOMNode('.ca-project-filters')) {
		if (document.documentElement.clientWidth < 768) {
			
			const filtersToggler = document.querySelector('.bc-inner-nav-icon');
			filtersToggler.addEventListener('click', (event) => {
				console.log(`small screen`);
				const thisDropdown = filtersToggler.nextElementSibling;
				const thisDropdownScrollHeight = thisDropdown.scrollHeight;
				if (hasClass(filtersToggler, 'active')) {
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							thisDropdown.removeAttribute('style');	
							removeClass(thisDropdown, 'active');
							removeClass(filtersToggler, 'active');
							removeClass(filtersToggler.closest('.bc-breadcrumbs-links'), 'active');
						});
					});	
				} else {
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							thisDropdown.style.height = thisDropdownScrollHeight + 'px';	
							addClass(thisDropdown, 'active');
							addClass(filtersToggler, 'active');
							addClass(filtersToggler.closest('.bc-breadcrumbs-links'), 'active');
						});
					});
				}
			});
		}
		filterCAProjects('all-projects'); 
		const projectFilters = _getAllDOMNodes('.ca-project-filter');
		
		projectFilters.forEach((filter) => {
			filter.addEventListener('click', (event) => {
				filterCAProjects(_getProjectFilter(event)).then(() => {
					console.log('then');
					projectFilters.forEach((el) => {
						removeClass(el, 'active');
					});
					addClass(event.target, 'active');
				}).catch((err) => {
					console.log(err);
				});
			});											 
		});
		
	}//end if .ca-projects-grid
		
})();


