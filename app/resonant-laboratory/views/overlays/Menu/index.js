import d3 from 'd3';
import Backbone from 'backbone';
import template from './template.html';

import './style.css';

let Menu = Backbone.View.extend({
  initialize: function (menuSpec) {
    this.menuSpec = menuSpec;
  },
  render: function () {
    if (!this.addedTemplate) {
      this.$el.html(template);
      this.addedTemplate = true;
    }

    let menuDiv = d3.select(this.el).select('div.menu');
    let menuItems = menuDiv.selectAll('.menuItem')
      .data(this.menuSpec.items);
    let menuItemsEnter = menuItems.enter()
      .append('div')
      .attr('class', d => d === null ? 'separator menuItem' : 'menuItem');
    menuItems.exit().remove();

    // Make sure that only the elements with icons have img elements
    menuItems.selectAll('img').filter(d => d === null || !d.icon).remove();
    menuItemsEnter.filter(d => d !== null && d.icon).append('img');
    menuItems.selectAll('img')
      .attr('src', d => typeof d.icon === 'function' ? d.icon() : d.icon);

    // Make sure that only the elements with text have p elements
    menuItems.selectAll('p').filter(d => d === null || !d.text).remove();
    menuItemsEnter.filter(d => d !== null && d.text).append('p');
    menuItems.selectAll('p')
      .text(d => typeof d.text === 'function' ? d.text() : d.text);

    // Make sure that only separators have hr elements
    menuItems.selectAll('hr').filter(d => d !== null).remove();
    menuItemsEnter.filter(d => d === null).append('hr');

    // Attach / update any events
    menuItems.on('click', d => {
      if (d !== null && d.onclick) {
        d.onclick();
        window.mainPage.overlay.render(null);
      }
    });

    // Move the menu to an appropriate place
    let targetBounds = this.menuSpec.targetElement.getBoundingClientRect();
    let menuBounds = menuDiv.node().getBoundingClientRect();

    if (window.innerWidth - targetBounds.right >= menuBounds.width) {
      // Default: put the menu to the right of the target
      menuDiv.style('left', targetBounds.right + 'px');
    } else if (targetBounds.left >= menuBounds.width) {
      // Move it to the left
      menuDiv.style('right', (window.innerWidth - targetBounds.left) + 'px');
    } else {
      // Sheesh, no space. Just put it on the right and let it overlap
      menuDiv.style('right', '0px');
    }

    if (window.innerHeight - targetBounds.top >= menuBounds.height) {
      // Default: align the menu to the top of the target
      menuDiv.style('top', targetBounds.top + 'px');
    } else {
      // Sheesh, no space. Just put it on the bottom and let it
      // overlap
      menuDiv.style('bottom', '0px');
    }
  }
});

export default Menu;
