-- AlterTable
ALTER TABLE `prayerstatus` MODIFY `status` ENUM('jamaah', 'onTime', 'afterHalfTime', 'late', 'missed', 'qadaa', 'none') NOT NULL DEFAULT 'none';
