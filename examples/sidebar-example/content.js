'use strict';

InboxSDK.load(1, 'sidebar-example', {
	inboxBeta: true,
	sidebarBeta: true,
	appName: 'Streak',
  appIconUrl: 'https://www.streak.com/images/orangeIcon.png'
}).then(inboxSDK => {
	window._sdk = inboxSDK;

	inboxSDK.Conversations.registerThreadViewHandler(function(threadView){

		var el = document.createElement("div");
		el.innerHTML = 'Hello world!';

		/*
		var cp = threadView.addSidebarContentPanel({
			title: 'Monkey',
			iconUrl: chrome.runtime.getURL('monkey-face.jpg'),
			el: el,
			orderHint: 2
		});

		cp.on('activate', function(){
			cp.remove();
		});
		*/

		window.activate = function() {
			var monkeyImages = [chrome.runtime.getURL('monkey.png'), chrome.runtime.getURL('monkey-face.jpg')];
			var monkeyIndex = 1;

			var el2 = document.createElement('div');
			el2.textContent = `Hello world ${Math.random()}`;

			var options = {
				title: 'Monkey 2',
				iconUrl: monkeyImages[monkeyIndex],
				el: el2,
				orderHint: 1
			};

			var stream = new Bacon.Bus();
			var contentPanel = threadView.addSidebarContentPanel(stream);

			stream.push(options);

			// just for testing at the dev console
			contentPanel.__options = options;
			contentPanel.__bus = stream;

			contentPanel.on('activate', function(){
				monkeyIndex = (monkeyIndex + 1)%2;
				options.iconUrl = monkeyImages[monkeyIndex];
				stream.push(options);
			});

			contentPanel.on('deactivate', function(){
				console.log('contentPanel deactivate');
			});

			contentPanel.on('destroy', function(){
				console.log('destroy');
			});

			return contentPanel;
		};

		window._firstPanel = window.activate();
	});

});
