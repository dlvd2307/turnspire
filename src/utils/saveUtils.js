export const saveScenarioToFile = (scenarioData, filename = "turnspire_scenario") => {
  const blob = new Blob([JSON.stringify(scenarioData, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
