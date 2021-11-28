
const images = [];

export default function handler(req, res) {

  switch (req.method) {
    case 'GET':
      return getImage(res, req.query.index);
    case 'POST':
      return postImage(res, JSON.parse(req.body).image);
    case 'DELETE':
      return deleteImage(res, JSON.parse(req.body).index);
  }

}

function getImage(res, index) {
  if (index < 0) {
    res.json(images);
  } else if (index < images.length ) {
    res.json([images[index]]);
  } else {
    res.status(404).end();
  }
}

function postImage(res, image) {
  images.push(image);
  res.end();
}

function deleteImage(res, index) {
  images.splice(index, 1);
  res.end();
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
