function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
export var SQLStatement = /*#__PURE__*/ function() {
    "use strict";
    function SQLStatement(strings, values) {
        _class_call_check(this, SQLStatement);
        _define_property(this, "strings", void 0);
        _define_property(this, "values", void 0);
        this.strings = strings;
        this.values = values;
    }
    _create_class(SQLStatement, [
        {
            key: "sql",
            get: function get() {
                return this.strings.join('?').replace(/\s+/g, ' ').trim();
            }
        },
        {
            key: "append",
            value: function append(statement) {
                if (_instanceof(statement, SQLStatement)) {
                    this.strings[this.strings.length - 1] += ' ' + statement.sql;
                    this.values.push.apply(this.values, statement.values);
                } else {
                    this.strings[this.strings.length - 1] += ' ' + statement;
                }
                return this;
            }
        }
    ]);
    return SQLStatement;
}();
export var SQL = function(strings) {
    for(var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        values[_key - 1] = arguments[_key];
    }
    return new SQLStatement(strings.slice(0), values);
};
export default SQL;

