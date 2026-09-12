export interface MapLocation {
  id: string;
  name: string;
  path: string;
}

export interface MapData {
  viewBox: string;
  locations: MapLocation[];
}

export const INDIA_MAP_DATA: MapData = {
  viewBox: "0 0 612 686",
  locations: [
    {
      id: "JK",
      name: "Jammu & Kashmir",
      path: "M 205,45 L 215,35 L 235,30 L 255,42 L 250,60 L 225,80 L 195,85 L 180,65 Z"
    },
    {
      id: "LA",
      name: "Ladakh",
      path: "M 235,30 L 275,15 L 320,35 L 340,75 L 305,100 L 250,60 L 255,42 Z"
    },
    {
      id: "HP",
      name: "Himachal Pradesh",
      path: "M 225,80 L 250,60 L 275,95 L 250,115 L 225,105 Z"
    },
    {
      id: "PB",
      name: "Punjab",
      path: "M 180,65 L 195,85 L 225,105 L 205,130 L 175,115 Z"
    },
    {
      id: "UT",
      name: "Uttarakhand",
      path: "M 250,115 L 275,95 L 305,100 L 300,140 L 265,135 Z"
    },
    {
      id: "HR",
      name: "Haryana",
      path: "M 205,130 L 225,105 L 250,115 L 240,150 L 210,160 Z"
    },
    {
      id: "DL",
      name: "Delhi",
      path: "M 235,142 L 242,142 L 242,149 L 235,149 Z"
    },
    {
      id: "RJ",
      name: "Rajasthan",
      path: "M 115,140 L 210,160 L 240,150 L 235,210 L 180,260 L 110,210 Z"
    },
    {
      id: "UP",
      name: "Uttar Pradesh",
      path: "M 240,150 L 265,135 L 300,140 L 360,190 L 325,235 L 250,215 L 235,210 Z"
    },
    {
      id: "BR",
      name: "Bihar",
      path: "M 360,190 L 420,195 L 430,235 L 370,245 L 360,220 Z"
    },
    {
      id: "SK",
      name: "Sikkim",
      path: "M 425,175 L 440,170 L 442,190 L 428,192 Z"
    },
    {
      id: "WB",
      name: "West Bengal",
      path: "M 420,195 L 445,195 L 440,240 L 420,310 L 395,305 L 410,260 L 430,235 Z"
    },
    {
      id: "JH",
      name: "Jharkhand",
      path: "M 370,245 L 430,235 L 410,260 L 395,305 L 350,290 Z"
    },
    {
      id: "OR",
      name: "Odisha",
      path: "M 350,290 L 395,305 L 420,310 L 385,380 L 340,360 L 335,320 Z"
    },
    {
      id: "CG",
      name: "Chhattisgarh",
      path: "M 315,260 L 350,290 L 335,320 L 340,360 L 295,370 L 295,310 Z"
    },
    {
      id: "MP",
      name: "Madhya Pradesh",
      path: "M 235,210 L 250,215 L 325,235 L 315,260 L 295,310 L 210,300 L 195,255 L 225,240 Z"
    },
    {
      id: "GJ",
      name: "Gujarat",
      path: "M 110,210 L 180,260 L 195,255 L 210,300 L 175,340 L 115,310 L 95,265 Z"
    },
    {
      id: "MH",
      name: "Maharashtra",
      path: "M 175,340 L 210,300 L 295,310 L 295,370 L 260,420 L 180,410 L 165,370 Z"
    },
    {
      id: "TS",
      name: "Telangana",
      path: "M 295,370 L 340,360 L 330,420 L 275,430 L 260,420 Z"
    },
    {
      id: "AP",
      name: "Andhra Pradesh",
      path: "M 340,360 L 385,380 L 325,480 L 280,470 L 275,430 L 330,420 Z"
    },
    {
      id: "KA",
      name: "Karnataka",
      path: "M 180,410 L 260,420 L 275,430 L 280,470 L 245,520 L 195,490 L 185,450 Z"
    },
    {
      id: "GA",
      name: "Goa",
      path: "M 180,410 L 185,425 L 178,430 L 175,415 Z"
    },
    {
      id: "KL",
      name: "Kerala",
      path: "M 215,510 L 245,520 L 235,570 L 210,560 Z"
    },
    {
      id: "TN",
      name: "Tamil Nadu",
      path: "M 245,520 L 280,470 L 290,510 L 265,580 L 235,570 Z"
    },
    {
      id: "AR",
      name: "Arunachal Pradesh",
      path: "M 490,165 L 560,150 L 580,185 L 530,200 L 490,185 Z"
    },
    {
      id: "AS",
      name: "Assam",
      path: "M 445,195 L 490,185 L 530,200 L 520,230 L 460,225 Z"
    },
    {
      id: "NL",
      name: "Nagaland",
      path: "M 530,200 L 565,195 L 555,225 L 530,215 Z"
    },
    {
      id: "MN",
      name: "Manipur",
      path: "M 525,225 L 555,225 L 545,255 L 520,245 Z"
    },
    {
      id: "MZ",
      name: "Mizoram",
      path: "M 510,250 L 535,250 L 525,285 L 505,275 Z"
    },
    {
      id: "TR",
      name: "Tripura",
      path: "M 485,245 L 505,245 L 500,270 L 485,260 Z"
    },
    {
      id: "ML",
      name: "Meghalaya",
      path: "M 460,210 L 505,210 L 500,230 L 460,225 Z"
    }
  ]
};
