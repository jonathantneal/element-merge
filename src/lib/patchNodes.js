import patch from './patch';
import patchAttrs from './patchAttrs';

export default function patchNodes (oldNode, newNode) {
	if (newNode.isEqualNode(oldNode)) {
		// stop merging nodes that are equal
		return true;
	}

	if (newNode.nodeType === 1 && newNode.nodeName === oldNode.nodeName) {
		// merge the attributes of elements with matching tags
		patchAttrs(newNode, oldNode);

		if (newNode.isEqualNode(oldNode)) {
			// stop merging nodes that are equal after merging attributes
			return true;
		}

		// merge the remaining children
		return patch(oldNode, newNode);
	} else if (newNode.nodeType === 3 || newNode.nodeType === 8) {
		if (oldNode.nodeValue !== newNode.nodeValue) {
			oldNode.nodeValue = newNode.nodeValue;
		}

		return true;
	}
}
