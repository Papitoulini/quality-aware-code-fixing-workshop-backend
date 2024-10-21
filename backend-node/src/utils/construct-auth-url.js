const constructAuthUrl = (token, owner, name) => `https://${token}@github.com/${owner}/${name}.git`;

export default constructAuthUrl;
