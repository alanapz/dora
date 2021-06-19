import { GitBranch, GitTag, GitTrackingBranch } from "src/generated/graphql";

export class AppUtils {

  static isRefBranch(ref: any): ref is GitBranch {
    return (ref && ref.__typename === 'GitBranch');
  }

  static isRefTrackingBranch(ref: any): ref is GitTrackingBranch {
    return (ref && ref.__typename === 'GitTrackingBranch');
  }

  static isRefTag(ref: any): ref is GitTag {
    return (ref && ref.__typename === 'GitTag');
  }
}
