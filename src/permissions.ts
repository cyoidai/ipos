
const Permission = {
  /** Full control over all organizations */
  Root: 1 << 31,
  /** Full control over the user's respective organization */
  Administrator: 1 << 30,
  ManageUsers: 1 << 25,
  ManageInventory: 1 << 6,
  ViewInventory: 1 << 5,
  /** Ability to use and interact with the POS */
  POS: 1,
  None: 0
};

export default Permission;
