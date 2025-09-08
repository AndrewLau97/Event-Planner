function handleSelect(e, categoryType, eventInfo, updateEventInfo) {
    const eventCategory = eventInfo.categoryType;
    eventCategory[categoryType] = e.target.value;
    updateEventInfo("categoryType", eventCategory);
  }

  export default handleSelect