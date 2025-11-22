import { DroneAction } from "../types";

  export function checkWhiteDwarf(id: string): boolean {
    const numId = parseInt(id, 10);

    return isNaN(numId) || numId < 287 || numId > 292;
  }

export const getTypeIcon = (type: DroneAction['type'], tabsrc: string) => {
  const commonProps = { size: "3vh", strokeWidth: 2.5 };
  const commonStyle = { filter: "grayscale(100%)" };

  const getImg = (src: string, styleOverride = {}) =>
    <img
      src={src}
      style={{ ...commonStyle, ...styleOverride }}
      {...commonProps}
    />;

  switch (type) {
    case 'Swift': return getImg(`${tabsrc}/icon_swift.png`);
    case 'Melee': return getImg(`${tabsrc}/icon_melee.png`);
    case 'Projectile': return getImg(`${tabsrc}/icon_projectile.png`);
    case 'Firing': return getImg(`${tabsrc}/icon_firing.png`);
    case 'Moving': return getImg(`${tabsrc}/icon_moving.png`);
    case 'Tactic': return getImg(`${tabsrc}/icon_tactic.png`);
    default: return getImg(`${tabsrc}/icon_passive.png`, { height: "1.8vh" });
  }
};

export const getCardBackGroundClassName = (faction: string, isPD: boolean = false) => {
  let backgroundClass = "";
  if (isPD) return "part-card-background-pd"
  switch (faction) {
    case "GOF":
      backgroundClass = "part-card-background-gof";
      break;
    case "UN":
      backgroundClass = "part-card-background-un";
      break;
    case "RDL":
      backgroundClass = "part-card-background-rdl";
      break;
    default:
      backgroundClass = "part-card-background-rdl";
      break;
  }

  return `${backgroundClass}`;
};


export const getDroneCardBackGroundClassName = (faction: string, isPD: boolean = false) => {
  let backgroundClass = "";
  if (isPD) return "drone-card-background-pd"

  switch (faction) {
    case "GOF":
      backgroundClass = "drone-card-background-gof";
      break;
    case "UN":
      backgroundClass = "drone-card-background-un";
      break;
    case "RDL":
      backgroundClass = "drone-card-background-rdl";
      break;
    default:
      backgroundClass = "drone-card-background-rdl";
      break;
  }

  return `${backgroundClass}`;
};