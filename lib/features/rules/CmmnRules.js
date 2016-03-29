'use strict';

var inherits = require('inherits');

var is = require('../../util/ModelUtil').is,
    isCasePlanModel = require('../../util/ModelUtil').isCasePlanModel,
    getDefinition = require('../../util/ModelUtil').getDefinition,
    isCollapsed = require('../../util/DiUtil').isCollapsed;

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

function isStage(element) {
  return !!(isCasePlanModel(element) || is(getDefinition(element), 'cmmn:Stage'));
}

/**
 * CMMN specific modeling rule
 */
function CmmnRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(CmmnRules, RuleProvider);

CmmnRules.$inject = [ 'eventBus' ];

module.exports = CmmnRules;

CmmnRules.prototype.init = function() {

  var self = this;

  this.addRule('shape.create', function(context) {

    var target = context.target,
        shapes = context.shapes;

    return self.canDrop(shapes, target);
  });

  this.addRule('shape.resize', function(context) {

    var shape = context.shape,
        newBounds = context.newBounds;

    return self.canResize(shape, newBounds);
  });

  this.addRule('elements.move', function(context) {
    return false;
  });

};


CmmnRules.prototype.canDrop = function(elements, target) {

  // only allow drop on a case plan model or on a stage
  if (!isStage(target)) {
    return false;
  }

  return !isCollapsed(target);
};


CmmnRules.prototype.canResize = function(shape, newBounds) {
  if (isStage(shape)) {
    return (!isCollapsed(shape)) && (
          !newBounds || (newBounds.width >= 100 && newBounds.height >= 80)
    );
  }

  return false;
};