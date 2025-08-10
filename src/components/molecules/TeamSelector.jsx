import React from "react";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

// Real team logos with official URLs
const englishTeamsWithLogos = [
  { 
    name: "Arsenal", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Arsenal-Logo.png",
    fallbackIcon: "Shield"
  },
  { 
    name: "Chelsea", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png",
    fallbackIcon: "Crown"
  },
  { 
    name: "Liverpool", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png",
    fallbackIcon: "Heart"
  },
  { 
    name: "Manchester City", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png",
    fallbackIcon: "Crown"
  },
  { 
    name: "Manchester United", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png",
    fallbackIcon: "Flame"
  },
  { 
    name: "Tottenham", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Tottenham-Logo.png",
    fallbackIcon: "Zap"
  },
  { 
    name: "Newcastle", 
    logo: "https://cdn.worldvectorlogo.com/logos/newcastle-united-fc.svg",
    fallbackIcon: "Mountain"
  },
  { 
    name: "Brighton", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Brighton-Hove-Albion-Logo.png",
    fallbackIcon: "Sun"
  },
  { 
    name: "West Ham", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/West-Ham-United-Logo.png",
    fallbackIcon: "Hammer"
  },
  { 
    name: "Aston Villa", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Aston-Villa-Logo.png",
    fallbackIcon: "Home"
  },
  { 
    name: "Crystal Palace", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Crystal-Palace-Logo.png",
    fallbackIcon: "Gem"
  },
  { 
    name: "Fulham", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Fulham-Logo.png",
    fallbackIcon: "Flag"
  },
  { 
    name: "Brentford", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Brentford-Logo.png",
    fallbackIcon: "Hexagon"
  },
  { 
    name: "Wolves", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Wolverhampton-Wanderers-Logo.png",
    fallbackIcon: "Moon"
  },
  { 
    name: "Everton", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Everton-Logo.png",
    fallbackIcon: "Star"
  },
  { 
    name: "Nottingham Forest", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Nottingham-Forest-Logo.png",
    fallbackIcon: "TreePine"
  }
];

const TeamSelector = ({ value, onChange, placeholder, error, className }) => {
  const selectedTeam = englishTeamsWithLogos.find(team => team.name === value);

  return (
    <div className="relative">
      <Select
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        className={cn("pl-10", className)}
      >
        {englishTeamsWithLogos.map(team => (
          <option key={team.name} value={team.name}>
            {team.name}
          </option>
        ))}
      </Select>
      
      {selectedTeam && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
          <img 
            src={selectedTeam.logo} 
            alt={`${selectedTeam.name} logo`}
            className="w-4 h-4 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <ApperIcon 
            name={selectedTeam.fallbackIcon} 
            size={16} 
            className="text-primary hidden"
          />
        </div>
      )}
    </div>
  );
};

export default TeamSelector;
export { englishTeamsWithLogos };