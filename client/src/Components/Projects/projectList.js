import projectImg from '../../Public/Assets/Media/Projects/project1.jpeg'
import projectImg2 from '../../Public/Assets/Media/Projects/project2.jpeg'
import projectImg3 from '../../Public/Assets/Media/Projects/project3.jpeg'
import projectImg4 from '../../Public/Assets/Media/Projects/project4.jpeg'

const projects = [
    {
      id: "1",
      name: "Project One lorem ipsuuuuuuuuumm",
      thumbnail: projectImg,
      gallery: {projectImg2,projectImg3,projectImg4},
      city: "Dubai",
      country: "UAE",
      materialsSupplied: ["Black Aswan", "Baltic Brown"], // Matches Product names
    },
    {
      id: "2",
      name: "Project Two",
      thumbnail: projectImg,
      gallery: {projectImg2,projectImg3,projectImg4},
      city: "Sharqa",
      country: "UAE",
      materialsSupplied: ["Ocean Jasper", "Arabescato"],
    },
    {
      id: "3",
      name: "Project Three",
      thumbnail: projectImg,
      gallery: {projectImg2,projectImg3,projectImg4},
      city: "city-1",
      country: "Kenya",
      materialsSupplied: ["Nero Marquina", "Amethyst"],
    },
    {
      id: "4",
      name: "Project Three",
      thumbnail: projectImg,
      gallery: {projectImg2,projectImg3,projectImg4},
      city: "city-2",
      country: "Kenya",
    },
    {
      id: "5",
      name: "Project Three",
      thumbnail: projectImg,
      gallery: {projectImg2,projectImg3,projectImg4},
      city: "Sharm El-Sheikh",
      country: "Egypt",
    },,
    {
      id: "6",
      name: "Project Three",
      thumbnail: projectImg,
      gallery: {projectImg2,projectImg3,projectImg4},
      city: "city",
      country: "China",
    },,
    {
      id: "7",
      name: "Project Three",
      thumbnail: projectImg,
      gallery: {projectImg2,projectImg3,projectImg4},
      city: "Cairo",
      country: "Egypt",
    },
  ];
  
  export default projects;
  