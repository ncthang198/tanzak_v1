/**
 * Mocking client-server processing
 */
const tags = [
  {"id": 1, book_count: 10, "name": "iPad 4 Mini"},
  {"id": 2, book_count: 21, "name": "H&M T-Shirt White"},
  {"id": 4, book_count: 22, "name": "Charli XCX - Sucker CD"},
  {"id": 5, book_count: 23, "name": "Honda"},
  {"id": 6, book_count: 26, "name": "Yamaha"},
  {"id": 7, book_count: 2, "name": "Suzuki"},
  {"id": 8, book_count: 3, "name": "Ducati"},
  {"id": 9, book_count: 29, "name": "BMW"},
  {"id": 10, book_count: 31, "name": "Audi 2"},
  {"id": 11, book_count: 90, "name": "Toyota 2"},
  {"id": 12, book_count: 80, "name": "iPad 4 Mini 2"},
  {"id": 22, book_count: 33, "name": "H&M T-Shirt White 2"},
  {"id": 24, book_count: 35, "name": "Charli XCX - Sucker CD 2"},
  {"id": 25, book_count: 38, "name": "Honda 2"},
  {"id": 26, book_count: 40, "name": "Yamaha 2"},
  {"id": 27, book_count: 37, "name": "Suzuki 2"},
  {"id": 28, book_count: 50, "name": "Ducati 2"},
  {"id": 29, book_count: 60, "name": "BMW 2"},
  {"id": 20, book_count: 90, "name": "Audi 2"},
  {"id": 21, book_count: 90, "name": "Toyota 3"},
]

const tag_books_list = [
  {
    id: 1,
    title: 'ハイキュー!! ショーセツバン!!',
    total_stories: 10,
    image_url: 'https://user-images.githubusercontent.com/35256283/51954618-81db9080-2473-11e9-83f7-85a271e5aaac.jpg',
    page_views: 10000,
    tags: [
      {
        id: 1,
        name: 'エンターテイメント',
        book_count: 20
      },
      {
        id: 2,
        name: 'スポトー',
        book_count: 10
      }
    ],
    authors: [
      {
        name: '星希代子',
        role: '著者'
      },
      {
        name: '古舘春一',
        role: '著者'
      }
    ],
    book_images: [
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954620-81db9080-2473-11e9-9dbd-5a935b7fbadc.jpg',
        caption: 'image1'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954621-82742700-2473-11e9-80fa-88070f2600f5.jpg',
        caption: 'image3'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954622-82742700-2473-11e9-9d6a-3acb65673387.jpg',
        caption: 'image4'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954623-830cbd80-2473-11e9-91e4-b1ea97d0cca1.jpg',
        caption: 'image5'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954624-830cbd80-2473-11e9-9812-c7ed6ee34cd9.jpg',
        caption: 'image6'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954625-830cbd80-2473-11e9-855e-2e5efaf71917.jpg',
        caption: 'image7'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954626-83a55400-2473-11e9-93fc-9ea51a2684c2.jpg',
        caption: 'image8'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954628-843dea80-2473-11e9-9fc3-43d7c2710833.jpg',
        caption: 'image9'
      }
    ]
  },
  {
    id: 2,
    title: 'ハイキュー!! ショーセツバン!!',
    total_stories: 10,
    image_url: 'https://user-images.githubusercontent.com/35256283/51954618-81db9080-2473-11e9-83f7-85a271e5aaac.jpg',
    page_views: 10,
    tags: [
      {
        id: 1,
        name: 'エンターテイメント',
        book_count: 20
      },
      {
        id: 2,
        name: 'スポトー',
        book_count: 10
      }
    ],
    authors: [
      {
        name: '星希代子',
        role: '著者'
      },
      {
        name: '古舘春一',
        role: '著者'
      }
    ],
    book_images: [
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954620-81db9080-2473-11e9-9dbd-5a935b7fbadc.jpg',
        caption: 'image1'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954621-82742700-2473-11e9-80fa-88070f2600f5.jpg',
        caption: 'image3'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954622-82742700-2473-11e9-9d6a-3acb65673387.jpg',
        caption: 'image4'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954623-830cbd80-2473-11e9-91e4-b1ea97d0cca1.jpg',
        caption: 'image5'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954624-830cbd80-2473-11e9-9812-c7ed6ee34cd9.jpg',
        caption: 'image6'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954625-830cbd80-2473-11e9-855e-2e5efaf71917.jpg',
        caption: 'image7'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954626-83a55400-2473-11e9-93fc-9ea51a2684c2.jpg',
        caption: 'image8'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954628-843dea80-2473-11e9-9fc3-43d7c2710833.jpg',
        caption: 'image9'
      }
    ]
  },
  {
    id: 3,
    title: 'ハイキュー!! ショーセツバン!!',
    total_stories: 10,
    image_url: 'https://user-images.githubusercontent.com/35256283/51954618-81db9080-2473-11e9-83f7-85a271e5aaac.jpg',
    page_views: 9000,
    tags: [
      {
        id: 1,
        name: 'エンターテイメント',
        book_count: 20
      },
      {
        id: 2,
        name: 'スポトー',
        book_count: 10
      }
    ],
    authors: [
      {
        name: '星希代子',
        role: '著者'
      },
      {
        name: '古舘春一',
        role: '著者'
      }
    ],
    book_images: [
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954620-81db9080-2473-11e9-9dbd-5a935b7fbadc.jpg',
        caption: 'image1'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954621-82742700-2473-11e9-80fa-88070f2600f5.jpg',
        caption: 'image3'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954622-82742700-2473-11e9-9d6a-3acb65673387.jpg',
        caption: 'image4'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954623-830cbd80-2473-11e9-91e4-b1ea97d0cca1.jpg',
        caption: 'image5'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954624-830cbd80-2473-11e9-9812-c7ed6ee34cd9.jpg',
        caption: 'image6'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954625-830cbd80-2473-11e9-855e-2e5efaf71917.jpg',
        caption: 'image7'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954626-83a55400-2473-11e9-93fc-9ea51a2684c2.jpg',
        caption: 'image8'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954628-843dea80-2473-11e9-9fc3-43d7c2710833.jpg',
        caption: 'image9'
      }
    ]
  },
  {
    id: 4,
    title: 'ハイキュー!! ショーセツバン!!',
    total_stories: 10,
    image_url: 'https://user-images.githubusercontent.com/35256283/51954618-81db9080-2473-11e9-83f7-85a271e5aaac.jpg',
    page_views: 2000,
    tags: [
      {
        id: 1,
        name: 'エンターテイメント',
        book_count: 20
      },
      {
        id: 2,
        name: 'スポトー',
        book_count: 10
      }
    ],
    authors: [
      {
        name: '星希代子',
        role: '著者'
      },
      {
        name: '古舘春一',
        role: '著者'
      }
    ],
    book_images: [
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954620-81db9080-2473-11e9-9dbd-5a935b7fbadc.jpg',
        caption: 'image1'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954621-82742700-2473-11e9-80fa-88070f2600f5.jpg',
        caption: 'image3'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954622-82742700-2473-11e9-9d6a-3acb65673387.jpg',
        caption: 'image4'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954623-830cbd80-2473-11e9-91e4-b1ea97d0cca1.jpg',
        caption: 'image5'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954624-830cbd80-2473-11e9-9812-c7ed6ee34cd9.jpg',
        caption: 'image6'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954625-830cbd80-2473-11e9-855e-2e5efaf71917.jpg',
        caption: 'image7'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954626-83a55400-2473-11e9-93fc-9ea51a2684c2.jpg',
        caption: 'image8'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954628-843dea80-2473-11e9-9fc3-43d7c2710833.jpg',
        caption: 'image9'
      }
    ]
  },
  {
    id: 5,
    title: 'ハイキュー!! ショーセツバン!!',
    total_stories: 10,
    image_url: 'https://user-images.githubusercontent.com/35256283/51954618-81db9080-2473-11e9-83f7-85a271e5aaac.jpg',
    page_views: 3000,
    tags: [
      {
        id: 1,
        name: 'エンターテイメント',
        book_count: 20
      },
      {
        id: 2,
        name: 'スポトー',
        book_count: 10
      }
    ],
    authors: [
      {
        name: '星希代子',
        role: '著者'
      },
      {
        name: '古舘春一',
        role: '著者'
      }
    ],
    book_images: [
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954620-81db9080-2473-11e9-9dbd-5a935b7fbadc.jpg',
        caption: 'image1'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954621-82742700-2473-11e9-80fa-88070f2600f5.jpg',
        caption: 'image3'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954622-82742700-2473-11e9-9d6a-3acb65673387.jpg',
        caption: 'image4'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954623-830cbd80-2473-11e9-91e4-b1ea97d0cca1.jpg',
        caption: 'image5'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954624-830cbd80-2473-11e9-9812-c7ed6ee34cd9.jpg',
        caption: 'image6'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954625-830cbd80-2473-11e9-855e-2e5efaf71917.jpg',
        caption: 'image7'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954626-83a55400-2473-11e9-93fc-9ea51a2684c2.jpg',
        caption: 'image8'
      },
      {
        image_url: 'https://user-images.githubusercontent.com/35256283/51954628-843dea80-2473-11e9-9fc3-43d7c2710833.jpg',
        caption: 'image9'
      }
    ]
  }
]
const _stories = [
  {"id": 1, "order": 5, "title": "iPad 4 Mini"},
  {"id": 2, "order": 7, "title": "H&M T-Shirt White"},
  {"id": 3, "order": 2, "title": "Charli XCX - Sucker CD"}
]

export default {
  getStories (cb) {
    setTimeout(() => cb(_stories), 200)
  },
  getTags (cb) {
    setTimeout(() => cb(tags), 200)
  },
  getTagBookList() {
    return tag_books_list
  }
}
