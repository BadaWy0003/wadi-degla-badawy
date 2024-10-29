import './Products.css';
import Galala from '../Assets/Media/Products/Galala.png'
import Sunny_Menia from '../Assets/Media/Products/Sunny-Menia.png'
import Selvia_Menia from '../Assets/Media/Products/Selvia-Menia.png'
import Felitto from '../Assets/Media/Products/Felitto.png'
// import Test_Mockup_1 from '../Assets/Media/Products/mockups/test-mockup-1.png'
// import Test_Mockup_2 from '../Assets/Media/Products/mockups/test-mockup-2.jpg'



export const productData = [
  {
    id: 1,
    name: 'Sunny Light',
    category: 'Egyptian Marble',
    finish: [ 
    {finishName: 'Polished', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light polished.png'},
    {finishName: 'Antique', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light antique.png'},
    {finishName: 'Brushed', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light brushed.png'},
    {finishName: 'Bush Hammered', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light bush hammered.png'},
    {finishName: 'Flamed', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light flamed.png'},
    {finishName: 'Honed', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light honed.png'},
    {finishName: 'Leather', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light leather.png'},
    {finishName: 'Rough', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light rough.png'},
    {finishName: 'Sand Blasted', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light sand blasted.png'},
    {finishName: 'Split Face', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light split face.png'},


  ],
    mockup: '/Components/Assets/Media/Products/mockups/test-mockup-1.png',
    mockupOutdoor: '/Components/Assets/Media/Products/mockups/test-mockup-1.png'
  },
  {
    id: 16,
    name: 'Black Aswan',
    category: 'Egyptian Granite',
    finish: [ 
    {finishName: 'Polished', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/sunny light polished.png'}
  ],
    mockup: '/Components/Assets/Media/Products/mockups/test-mockup-1.png'
  },
  {
    id: 31,
    name: 'Amethyst',
    category: 'Imported Marble',
    finish: [ 
    {finishName: 'Polished', imageUrl: '/Components/Assets/Media/Products/Egyptian Marble/1-Sunny light/sunny light polished.png'}
  ],
    mockup: '/Components/Assets/Media/Products/mockups/test-mockup-1.png',
    mockupOutdoor: '/Components/Assets/Media/Products/mockups/test-mockup-1.png'
  }
];