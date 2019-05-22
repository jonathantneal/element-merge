export default function patchAttrs (newNode, oldNode) {
	let i;

	// remove unused attributes
	for (i = oldNode.attributes.length; i--;) {
		if (!(oldNode.attributes[i].name in newNode.attributes)) {
			oldNode.removeAttributeNS(oldNode.attributes[i].namespaceURI, oldNode.attributes[i].name);
		}
	}

	// add missing attributes
	for (i = newNode.attributes.length; i--;) {
		if (newNode.attributes[i].value !== Object(oldNode.attributes[newNode.attributes[i].name]).value) {
			oldNode.setAttributeNS(newNode.attributes[i].namespaceURI, newNode.attributes[i].name, newNode.attributes[i].value);
		}
	}
}
