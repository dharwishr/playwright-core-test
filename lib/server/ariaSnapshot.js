"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAriaSnapshot = parseAriaSnapshot;
var _utilsBundle = require("../utilsBundle");
/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function parseAriaSnapshot(text) {
  const parseKey = key => {
    if (!key) return {
      role: ''
    };
    const match = key.match(/^([a-z]+)(?:\s+(?:"([^"]*)"|\/([^\/]*)\/))?$/);
    if (!match) throw new Error(`Invalid key ${key}`);
    const role = match[1];
    if (role && role !== 'text' && !allRoles.includes(role)) throw new Error(`Invalid role ${role}`);
    if (match[2]) return {
      role,
      name: match[2]
    };
    if (match[3]) return {
      role,
      name: new RegExp(match[3])
    };
    return {
      role
    };
  };
  const valueOrRegex = value => {
    return value.startsWith('/') && value.endsWith('/') ? new RegExp(value.slice(1, -1)) : value;
  };
  const convert = object => {
    const key = typeof object === 'string' ? object : Object.keys(object)[0];
    const value = typeof object === 'string' ? undefined : object[key];
    const parsed = parseKey(key);
    if (parsed.role === 'text') {
      if (typeof value !== 'string') throw new Error(`Generic role must have a text value`);
      return valueOrRegex(value);
    }
    if (Array.isArray(value)) parsed.children = value.map(convert);else if (value) parsed.children = [valueOrRegex(value)];
    return parsed;
  };
  const fragment = _utilsBundle.yaml.parse(text);
  return convert({
    '': fragment
  });
}
const allRoles = ['alert', 'alertdialog', 'application', 'article', 'banner', 'blockquote', 'button', 'caption', 'cell', 'checkbox', 'code', 'columnheader', 'combobox', 'command', 'complementary', 'composite', 'contentinfo', 'definition', 'deletion', 'dialog', 'directory', 'document', 'emphasis', 'feed', 'figure', 'form', 'generic', 'grid', 'gridcell', 'group', 'heading', 'img', 'input', 'insertion', 'landmark', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee', 'math', 'meter', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 'option', 'paragraph', 'presentation', 'progressbar', 'radio', 'radiogroup', 'range', 'region', 'roletype', 'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'section', 'sectionhead', 'select', 'separator', 'slider', 'spinbutton', 'status', 'strong', 'structure', 'subscript', 'superscript', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term', 'textbox', 'time', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem', 'widget', 'window'];