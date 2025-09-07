const zip_file = new JSZip();
function download_blob() {
 zip_file.generateAsync({type:"blob"})
	.then(function(content) {
	    saveAs(content, "CraftrDoinTextures.zip");
	});
}
async function get_contents () {
	const sha_response = await fetch("https://api.github.com/repos/Crafter-san/CraftrDoinTextures/branches/main");
	const sha = await sha_response.json().commit.sha;
	const contents_response = await fetch("https://api.github.com/repos/Crafter-san/CraftrDoinTextures/git/trees/" + sha + "?recursive=true");
	const contents = await contents_response.json();
	return contents;
}
async function get_blob (sha) {
	const contents_response = await fetch("https://api.github.com/repos/Crafter-san/CraftrDoinTextures/branches/git/blobs/" + sha);
	const contents = await contents_response.json();
	return contents;
}
async function zip () {
	const contents = await get_contents();
	for (const item of contents.tree) {
		if (item.type === "tree") {
			zip_file.folder(item.path);
		}
		else if (item.type === "blob") {
			const contents = get_blob(item.sha);
			zip_file.file(item.path, contents.content, {base64: (contents.encoding === "base64")});
		}
	}
	download_blob();
}
