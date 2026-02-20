import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import coffeePlantIcon from '../assets/coffee-plant.png';

interface Origin {
  name: string;
  enName: string;
  lat: number;
  lng: number;
}

interface RegionData {
  name: string;
  icon: string;
  color: string;
  origins: Origin[];
}

interface WorldMapProps {
  regions: Record<string, RegionData>;
  selectedContinent: string;
  onOriginClick: (enName: string, lat: number, lng: number, name: string) => void;
  selectedOrigin?: string;
  hoveredOrigin?: string | null;
  setHoveredOrigin: (origin: string | null) => void;
}

// 监听区域变化自动跳转
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

// 创建咖啡树标记 - 使用 PNG 图片
// index 用于计算偏移，避免重叠
const createCoffeeMarkerIcon = (color: string, isActive: boolean, isHovered: boolean, index: number = 0) => {
  const size = isActive ? 42 : 34;
  const scale = isActive ? 1.15 : isHovered ? 1.08 : 1;
  const filter = `drop-shadow(0 2px 3px rgba(0,0,0,0.3)) ${isActive ? 'none' : `hue-rotate(${getHueRotation(color)}deg)`}`;

  // 根据索引计算偏移（每3个一组，菱形分布）
  const offsetPatterns = [
    { x: 0, y: 0 },      // 0: 中心
    { x: 1.5, y: -1 },   // 1: 右上
    { x: -1.5, y: -1 },  // 2: 左上
    { x: 0, y: -2 },     // 3: 上
    { x: 1.5, y: 1 },   // 4: 右下
    { x: -1.5, y: 1 },  // 5: 左下
  ];
  const offset = offsetPatterns[index % offsetPatterns.length];

  return L.divIcon({
    className: 'coffee-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-image: url('${coffeePlantIcon}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        transform: scale(${scale}) translate(${offset.x}px, ${offset.y}px);
        transform-origin: center;
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        filter: ${filter};
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// 根据颜色计算色相旋转角度
const getHueRotation = (color: string): number => {
  const colorMap: Record<string, number> = {
    '#E07A5F': 0,  // 亚洲 - 珊瑚红
    '#F2CC8F': 30, // 非洲 - 黄色
    '#81B29A': 150 // 美洲 - 绿色
  };
  return colorMap[color] || 0;
};

// 创建圆形标记（备选）
const createMarkerIcon = (color: string, isActive: boolean) => {
  const size = isActive ? 22 : 16;
  const borderWidth = isActive ? 3 : 2;
  return L.divIcon({
    className: 'coffee-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: ${borderWidth}px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default function WorldMap({
  regions,
  selectedContinent,
  onOriginClick,
  selectedOrigin,
  hoveredOrigin,
  setHoveredOrigin,
}: WorldMapProps) {
  const currentRegion = regions[selectedContinent];

  // 根据选择的大洲计算中心点和缩放
  const getRegionView = (): { center: [number, number]; zoom: number } => {
    switch (selectedContinent) {
      case 'americas':
        return { center: [15, -75], zoom: 3 };
      case 'africa':
        return { center: [5, 20], zoom: 3 };
      case 'asia':
        return { center: [15, 100], zoom: 3 };
      default:
        return { center: [20, 0], zoom: 2 };
    }
  };

  const regionView = getRegionView();

  return (
    <div style={{ position: 'relative' }}>
      {/* 区域标签 */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 1000,
        background: 'white',
        padding: '6px 14px',
        borderRadius: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        fontSize: '14px',
        fontWeight: 600,
        color: currentRegion.color,
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>{currentRegion.icon}</span>
        <span>{currentRegion.name}</span>
      </div>

      <div className="coffee-map-container" style={{ height: '420px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer
          center={regionView.center}
          zoom={regionView.zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          dragging={true}
          zoomControl={false}
          minZoom={2}
          maxZoom={10}
          worldCopyJump={true}
        >
          <TileLayer
            attribution='&copy; CartoDB'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <MapController center={regionView.center} zoom={regionView.zoom} />

          {currentRegion.origins.map((origin, index) => {
            const isSelected = selectedOrigin === origin.enName;
            const isHovered = hoveredOrigin === origin.enName;
            const isActive = isSelected || isHovered;

            return (
              <Marker
                key={origin.enName}
                position={[origin.lat, origin.lng]}
                icon={createCoffeeMarkerIcon(currentRegion.color, isActive, isHovered, index)}
                eventHandlers={{
                  click: () => onOriginClick(origin.enName, origin.lat, origin.lng, origin.name),
                  mouseover: () => setHoveredOrigin(origin.enName),
                  mouseout: () => setHoveredOrigin(null),
                }}
              >
                <Popup>
                  <div style={{
                    fontFamily: 'Georgia, serif',
                    padding: '4px 8px',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #FAF6F1 0%, #F5EDE4 100%)',
                    borderRadius: '8px',
                    border: '1px solid #D4C4B5',
                  }}>
                    <strong style={{ color: '#4A3728', fontSize: '15px', letterSpacing: '0.5px' }}>
                      {origin.name}
                    </strong>
                    <div style={{ fontSize: '11px', color: '#8B7355', marginTop: '3px', fontStyle: 'italic' }}>
                      {origin.enName}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <style>{`
        .coffee-map-container .leaflet-tile {
          filter: sepia(30%) saturate(120%) brightness(105%) hue-rotate(-5deg);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(74, 55, 40, 0.2);
          border: 1px solid #D4C4B5;
        }
        .leaflet-popup-content {
          margin: 6px 10px;
        }
        .leaflet-popup-tip {
          background: #FAF6F1;
          border: 1px solid #D4C4B5;
        }
        .coffee-marker {
          background: transparent;
          border: none;
        }
        .coffee-marker svg {
          cursor: pointer;
        }
        .coffee-marker svg:hover {
          filter: drop-shadow(0 3px 5px rgba(0,0,0,0.4)) !important;
        }
      `}</style>
    </div>
  );
}
