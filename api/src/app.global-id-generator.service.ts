import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * This class is responsible for generating unique IDs for the application. It is inspired by Twitter's
 * Snowflake ID generation algorithm.
 * Bitwise operations execute in constant time O(1), much faster than arithmetic operations.
 *A Snowflake ID is composed of:
 * - 41 bits for the timestamp in milliseconds (gives us roughly 69 years with a custom epoch)
 * - 10 bits for the machineId ID (gives us up to 1024 machines)
 * - 12 bits for the sequence number (gives us up to 4096 IDs per millisecond)
 * The machineId ID is a custom value that should be unique for each instance of the generator.
 */
@Injectable()
export class AppGlobalIdGeneratorService {
  private static readonly MACHINE_ID_BITS = 10;
  private static readonly SEQUENCE_BITS = 12;

  private readonly epoch: number = 1609459200000;
  // TODO must be configurable
  private readonly machineId: number = 1;
  private sequence: number;
  private lastTimestamp: number;

  // indexing starts at 0: 2^(MACHINE_ID_BITS) - 1
  private static readonly MAX_MACHINE_ID =
    (1 << AppGlobalIdGeneratorService.MACHINE_ID_BITS) - 1;
  // indexing starts at 0: 2^(SEQUENCE_BITS) - 1
  private static readonly MAX_SEQUENCE =
    (1 << AppGlobalIdGeneratorService.SEQUENCE_BITS) - 1;

  constructor(private readonly configService: ConfigService) {
    this.machineId = Number(this.configService.get<number>('MACHINE_ID'));
    if (
      this.machineId < 0 ||
      this.machineId > AppGlobalIdGeneratorService.MAX_MACHINE_ID
    ) {
      throw new Error(
        `Invalid MACHINE_ID. Must be between 0 and ${AppGlobalIdGeneratorService.MAX_MACHINE_ID}.`,
      );
    }
    this.sequence = 0;
    this.lastTimestamp = -1;
  }

  private waitUntilNextMillisecond(): void {
    while (this.lastTimestamp <= Date.now()) {
      this.lastTimestamp = Date.now();
    }
  }

  /**
   * Generate a new unique ID within the current timestamp using the Snowflake algorithm. If the number
   * of ids generated in the same millisecond exceeds the maximum sequence number, the function will wait
   * until the next millisecond to generate a new ID. Otherwise, it will generate a new ID using the snowflake
   * algorithm by combining the current timestamp, machineId, and sequence number.
   * It uses bitwise operations, that execute in O(1), to simulate a highly performant Id generator capable of
   * generating a hundred of thousands of IDs per millisecond.
   */
  public generateId(): bigint {
    const currentTimestamp = Date.now();
    if (currentTimestamp < this.lastTimestamp) {
      throw new Error(
        'Clock have move backwards. Cannot generate ID until clock moves forward.',
      );
    }

    if (currentTimestamp === this.lastTimestamp) {
      this.sequence =
        (this.sequence + 1) & AppGlobalIdGeneratorService.MAX_SEQUENCE;
      if (this.sequence == 0) {
        this.waitUntilNextMillisecond();
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = currentTimestamp;
    // Combine all parts of the ID to generate a unique ID:
    // First, shift the current timestamps to the left to reach the right position in the ID, after the machineId and
    // sequence number.
    // Second, shift the machineId to the left to reach the right position in the ID, after the sequence
    // Finally, add the sequence number to the ID.

    // prettier-ignore
    const id =
      (BigInt(currentTimestamp - this.epoch) <<
        BigInt(
          AppGlobalIdGeneratorService.MACHINE_ID_BITS +
            AppGlobalIdGeneratorService.SEQUENCE_BITS,
        )) |
      (BigInt(this.machineId) <<
        BigInt(AppGlobalIdGeneratorService.SEQUENCE_BITS)) |
      BigInt(this.sequence);

    return id;
  }
}
