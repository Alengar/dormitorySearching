export const ensureBoolean = (value) => {
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return value;
};

export const calculateUnseenMessages = (messages, isManager) => {
  return messages.filter((item) => item.isManager === isManager && item.isSeen === false).length;
};
