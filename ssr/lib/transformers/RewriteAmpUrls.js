/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const {join} = require('path');

const AMP_CACHE_PREFIX = 'https://cdn.ampproject.org';

/**
 * RewriteAmpUrls - rewrites all AMP runtime URLs to the origin
 * the AMP is being served from. This saves an additional HTTPS
 * request on initial page load. Use the `ampUrlPrefix` parameter
 * to configure a AMP runtime path prefix.
 */
class RewriteAmpUrls {
  transform(tree, params) {
    const html = tree.root.firstChildByTag('html');
    const head = html.firstChildByTag('head');
    if (!head) return;

    const ampUrlPrefix = params.ampUrlPrefix || '';

    for (let i = 0, len = head.children.length; i < len; i++) {
      const node = head.children[i];
      if (node.tagName === 'script' && this._usesAmpCacheUrl(node.attribs.src)) {
        node.attribs.src = this._replaceUrl(node.attribs.src, ampUrlPrefix);
      } else if (node.tagName === 'link' && this._usesAmpCacheUrl(node.attribs.href)) {
        node.attribs.href = this._replaceUrl(node.attribs.href, ampUrlPrefix);
      }
    }
  }

  _usesAmpCacheUrl(url) {
    if (!url) {
      return;
    }
    return url.startsWith(AMP_CACHE_PREFIX);
  }

  _replaceUrl(url, ampUrlPrefix) {
    return join(ampUrlPrefix, url.substring(AMP_CACHE_PREFIX.length));
  }
}

module.exports = new RewriteAmpUrls();