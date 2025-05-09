import { Stage, Layer, Rect, Text, Group, Circle, Line, Transformer } from "react-konva";
import { useCombat } from "../context/CombatContext";
import { useRef, useEffect } from "react";

const TokenBoard = () => {
  const {
    characters,
    gridConfig,
    updateCharacterPosition,
    selectCharacter,
    selectedCharacterId,
    spellMarkers,
    setSpellMarkers,
    selectedMarkerId,
    setSelectedMarkerId,
    markDefeated,
  } = useCombat();

  const { rows, cols, squareSize } = gridConfig;
  const width = cols * squareSize;
  const height = rows * squareSize;

  const transformerRef = useRef();
  const shapeRefs = useRef({});

  const handleDragEnd = (e, charId) => {
    const x = Math.round(e.target.x() / squareSize) * squareSize;
    const y = Math.round(e.target.y() / squareSize) * squareSize;
    updateCharacterPosition(charId, { x, y });
  };

  const handleMarkerDrag = (e, id) => {
    const x = Math.round(e.target.x() / squareSize) * squareSize;
    const y = Math.round(e.target.y() / squareSize) * squareSize;
    setSpellMarkers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, x, y } : m))
    );
  };

  const getHPColor = (percent) => {
    if (percent > 0.7) return "#10B981";
    if (percent > 0.4) return "#FBBF24";
    return "#EF4444";
  };

  useEffect(() => {
    if (transformerRef.current && selectedMarkerId) {
      const node = shapeRefs.current[selectedMarkerId];
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedMarkerId, spellMarkers]);

  return (
    <div className="mx-auto mb-6 border border-gray-700 rounded overflow-hidden">
      <Stage width={width} height={height} draggable style={{ backgroundColor: "#1F2937" }}>
        {/* Grid */}
        <Layer>
          {Array.from({ length: rows }).map((_, row) =>
            Array.from({ length: cols }).map((_, col) => (
              <Rect
                key={`${row}-${col}`}
                x={col * squareSize}
                y={row * squareSize}
                width={squareSize}
                height={squareSize}
                stroke="#4B5563"
              />
            ))
          )}
        </Layer>

        {/* Spell Markers */}
        <Layer>
          {spellMarkers.map((m) => {
            const sizePx = m.squares * squareSize;

            const markerProps = {
              x: m.x,
              y: m.y,
              rotation: m.rotation || 0,
              draggable: true,
              onDragEnd: (e) => handleMarkerDrag(e, m.id),
              onClick: () => {
                setSelectedMarkerId(m.id);
                selectCharacter(null);
              },
              onTap: () => {
                setSelectedMarkerId(m.id);
                selectCharacter(null);
              },
              ref: (node) => (shapeRefs.current[m.id] = node),
              onTransformEnd: () => {
                const node = shapeRefs.current[m.id];
                const rotation = node.rotation();
                setSpellMarkers((prev) =>
                  prev.map((marker) =>
                    marker.id === m.id ? { ...marker, rotation } : marker
                  )
                );
              },
            };

            return (
              <Group key={m.id} {...markerProps}>
                {m.shape === "cube" && (
                  <Rect
                    width={sizePx}
                    height={sizePx}
                    stroke="#FBBF24"
                    fill="rgba(251, 191, 36, 0.2)"
                    strokeWidth={2}
                    dash={[6, 4]}
                    cornerRadius={4}
                  />
                )}
                {m.shape === "sphere" && (
                  <Circle
                    radius={sizePx / 2}
                    stroke="#FBBF24"
                    fill="rgba(251, 191, 36, 0.2)"
                    strokeWidth={2}
                    dash={[6, 4]}
                    x={sizePx / 2}
                    y={sizePx / 2}
                  />
                )}
                {m.shape === "cone" && (
                  <Line
                    points={[0, 0, sizePx, 0, 0, sizePx]}
                    closed
                    fill="rgba(251, 191, 36, 0.2)"
                    stroke="#FBBF24"
                    strokeWidth={2}
                  />
                )}

                <Text
                  text={m.label}
                  fontSize={12}
                  fill="white"
                  align="center"
                  x={0}
                  y={sizePx + 2}
                  width={sizePx}
                />

                <Text
                  text="✖"
                  fontSize={14}
                  fill="#f87171"
                  x={sizePx - 14}
                  y={-6}
                  width={12}
                  height={12}
                  onClick={() => {
                    const confirmed = confirm("Remove this spell marker?");
                    if (confirmed) {
                      setSpellMarkers((prev) => prev.filter((marker) => marker.id !== m.id));
                      setSelectedMarkerId(null);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Group>
            );
          })}
          <Transformer ref={transformerRef} rotateEnabled={true} enabledAnchors={[]} />
        </Layer>

        {/* Character Tokens */}
        <Layer>
          {characters.map((char) => {
            const { hp = 100, maxHp = 100 } = char;
            const percent = Math.max(0, Math.min(1, hp / maxHp));
            const pos = char.position || { x: 0, y: 0 };
            const isEnemy = char.type === "enemy";
            const isSelected = selectedCharacterId === char.id;
            const isDefeated = char.defeated;
            const hasCondition = char.conditions?.length > 0;
            const hasConcentration = !!char.concentration;

            const baseColor = isEnemy ? "#DC2626" : "#6366F1";
            const selectedColor = isEnemy ? "#B91C1C" : "#4F46E5";

            return (
              <Group
                key={char.id}
                x={pos.x}
                y={pos.y}
                draggable={!isDefeated}
                onDragEnd={(e) => handleDragEnd(e, char.id)}
                onClick={() => {
                  selectCharacter(char.id);
                  setSelectedMarkerId(null);
                }}
              >
                <Rect x={0} y={-10} width={squareSize} height={6} fill="#374151" cornerRadius={2} />
                <Rect
                  x={0}
                  y={-10}
                  width={squareSize * percent}
                  height={6}
                  fill={getHPColor(percent)}
                  cornerRadius={2}
                />

                {hasCondition && (
                  <Circle
                    x={squareSize / 2}
                    y={squareSize / 2}
                    radius={squareSize / 2 + 4}
                    stroke="#F59E0B"
                    strokeWidth={2}
                  />
                )}

                {hasConcentration && (
                  <Circle
                    x={squareSize / 2}
                    y={squareSize / 2}
                    radius={squareSize / 2 + 8}
                    stroke="#EAB308"
                    strokeWidth={2}
                    dash={[4, 2]}
                  />
                )}

                <Rect
                  width={squareSize}
                  height={squareSize}
                  fill={
                    isDefeated
                      ? "#4B5563"
                      : isSelected
                      ? selectedColor
                      : baseColor
                  }
                  cornerRadius={8}
                  stroke="#E5E7EB"
                  strokeWidth={2}
                />

                <Text
                  text={char.name[0]}
                  fontSize={20}
                  fill="white"
                  align="center"
                  verticalAlign="middle"
                  x={0}
                  y={0}
                  width={squareSize}
                  height={squareSize}
                />

                <Text
                  text={char.name}
                  fontSize={12}
                  fill={isDefeated ? "#9CA3AF" : "white"}
                  align="center"
                  x={0}
                  y={squareSize + 2}
                  width={squareSize}
                />

                <Text
                  text={`${char.hp} / ${char.maxHp}`}
                  fontSize={10}
                  fill={isDefeated ? "#9CA3AF" : "#D1D5DB"}
                  align="center"
                  x={0}
                  y={squareSize + 14}
                  width={squareSize}
                />

                {char.ac !== undefined && (
                  <Text
                    text={`AC: ${char.ac}`}
                    fontSize={10}
                    fill={isDefeated ? "#9CA3AF" : "#FBBF24"}
                    align="center"
                    x={0}
                    y={squareSize + 26}
                    width={squareSize}
                  />
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default TokenBoard;
